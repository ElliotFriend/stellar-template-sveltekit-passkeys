import 'dotenv/config';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { sync as glob } from 'glob';

// Load environment variables starting with `PUBLIC_` into the environment, so
// we don't need to specify duplicate variables in .env
for (const key in process.env) {
    if (key.startsWith('PUBLIC_')) {
        process.env[key.substring(7)] = process.env[key];
    }
}

console.log('###################### Initializing ########################');

// Get the absolute path to the project directory (i.e. where this
// `initialize.js` script is located)
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Rust targets the Stellar CLI may have built our contracts into
const WASM_TARGETS = ['wasm32v1-none', 'wasm32-unknown-unknown'];

/**
 * This function logs and then executes a shell command.
 * @param {string} command shell command to run
 */
function exe(command) {
    // log the command which will run to standard out
    console.log(command);
    // execute the command, waiting for it to return before moving on
    execSync(command, { stdio: 'inherit' });
}

/**
 * Logs and executes a shell command, returning its standard output. The
 * command's standard error still streams to our own, so the Stellar CLI's
 * progress messages stay visible.
 * @param {string} command shell command to run
 * @returns {string} the command's trimmed standard output
 */
function exeCapture(command) {
    console.log(command);
    return execSync(command, { stdio: ['inherit', 'pipe', 'inherit'] })
        .toString()
        .trim();
}

/**
 * Generates a new keypair, and funds it if we're not using Mainnet.
 */
function fundAll() {
    exe(`stellar keys generate ${process.env.STELLAR_ACCOUNT} | true`);
    if (
        process.env.STELLAR_NETWORK_PASSPHRASE !== 'Public Global Stellar Network ; September 2015'
    ) {
        exe(
            `stellar keys fund ${process.env.STELLAR_ACCOUNT} --network ${process.env.STELLAR_NETWORK}`,
        );
    }
}

/**
 * Removes files matching a glob pattern. Used for cleaning old contract builds.
 * @param {string} pattern pattern to match with the rm command
 */
function removeFiles(pattern) {
    console.log(`remove ${pattern}`);
    glob(pattern).forEach((entry) => rmSync(entry));
}

/**
 * Finds every compiled Wasm file in the project. The Stellar CLI builds to
 * `wasm32v1-none` these days, but older versions used
 * `wasm32-unknown-unknown`, so we look in both places.
 * @returns {string[]} paths to the compiled Wasm files
 */
function wasmFiles() {
    return WASM_TARGETS.flatMap((target) => glob(`${dirname}/target/${target}/release/*.wasm`));
}

/**
 * Removes old contract builds, and re-builds smart contracts.
 */
function buildAll() {
    for (const target of WASM_TARGETS) {
        removeFiles(`${dirname}/target/${target}/release/*.wasm`);
        removeFiles(`${dirname}/target/${target}/release/*.d`);
    }
    exe(`stellar contract build`);
}

/**
 * Takes a file name or path, and returns only the filename portion. For
 * example, the filename `/something/cool.txt` will return `cool`.
 * @param {string} filename full file name or path to extract the name from
 * @returns {string} the name of the file, with no extension or leading path
 */
function filenameNoExtension(filename) {
    return path.basename(filename, path.extname(filename));
}

/**
 * Deploy a contract's Wasm file to the network. The Stellar CLI prints the
 * deployed contract address on standard out, which is where we get it from:
 * where the CLI stores its aliases has moved around between versions.
 * @param {string} wasm path to the compiled Wasm file
 * @returns {{ alias: string, id: string }} the contract's alias and address
 */
function deploy(wasm) {
    const alias = filenameNoExtension(wasm);
    const id = exeCapture(
        `stellar contract deploy --wasm ${wasm} --ignore-checks --alias ${alias}`,
    );

    return { alias, id };
}

/**
 * Iterate through all compiled Wasm files in the project, and deploy them to
 * the network.
 * @returns {{ alias: string, id: string }[]} the deployed contracts
 */
function deployAll() {
    return wasmFiles().map(deploy);
}

/**
 * Generate a contract bindings package for the specified contract address,
 * outputs to a directory based on the alias.
 * @param {{alias: string, id: string}} contract the contract to generate bindings for
 */
function bind({ alias, id }) {
    const packageDir = `${dirname}/packages/${alias}`;

    exe(`stellar contract bindings typescript --id ${id} --output-dir ${packageDir} --overwrite`);

    // The generated package.json only defines `build`. Adding `prepare` lets
    // pnpm compile the bindings automatically whenever someone installs the
    // workspace, so `dist/` never has to be committed.
    const manifestPath = `${packageDir}/package.json`;
    const manifest = JSON.parse(readFileSync(manifestPath));
    manifest.scripts = { ...manifest.scripts, prepare: 'tsc' };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);

    // Since the bindings are compiled on install, the compiled output doesn't
    // belong in version control either.
    const ignorePath = `${packageDir}/.gitignore`;
    const ignored = readFileSync(ignorePath, 'utf8');
    if (!ignored.split('\n').includes('dist/')) {
        writeFileSync(ignorePath, `${ignored.trimEnd()}\ndist/\n`);
    }

    // The CLI writes a standalone package, but inside a workspace the root
    // lockfile is the only one that matters.
    rmSync(`${packageDir}/pnpm-lock.yaml`, { force: true });
}

/**
 * Iterate through all deployed contracts and run the `bind()` function for
 * each one.
 * @param {{ alias: string, id: string }[]} contracts the deployed contracts
 */
function bindAll(contracts) {
    contracts.forEach(bind);
}

/**
 * Create a library file importing the bindings package(s) for use in frontend
 * code.
 * @param {{ alias: string }} contract the contract address to create a library for
 */
function importContract({ alias }) {
    // make sure a directory is ready to store our deployed library file
    const outputDir = `${dirname}/src/lib/contracts/`;
    mkdirSync(outputDir, { recursive: true });

    // the required imports/exports for the library
    const importContent =
        `import { Client, networks } from '${alias}';\n` +
        `import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';\n\n` +
        `export default new Client({\n` +
        `    ...networks.${process.env.STELLAR_NETWORK},\n` +
        `    rpcUrl: PUBLIC_STELLAR_RPC_URL,\n` +
        `});\n`;

    // output the file contents to the specified file
    const outputPath = `${outputDir}/${alias}.ts`;
    writeFileSync(outputPath, importContent);

    // log a message to the console
    console.log(`Created import for ${alias}`);
}

/**
 * Iterate through all deployed contracts and run the `importContract()`
 * function for each one.
 * @param {{ alias: string }[]} contracts the deployed contracts
 */
function importAll(contracts) {
    contracts.forEach(importContract);
}

/* Now, we call the functions we've written in the order we want them to happen: */
// 1. generate and (optionally) fund an account
fundAll();
// 2. compile and build contracts
buildAll();
// 3. deploy all built contracts
const deployed = deployAll();
// 4. generate bindings for all deployed contracts
bindAll(deployed);
// 5. create a library file importing each bindings package into the frontend
importAll(deployed);
