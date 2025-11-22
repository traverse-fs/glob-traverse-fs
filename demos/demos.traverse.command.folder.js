const fs = require('fs').promises;
const path = require('path');
const { resolve, dirname, join } = path;
const { traversePath, getDirectorySize, traverseFS } = require("../index.js")


// The main function that sets up and runs the demonstration
async function main() {
    console.log('--- Starting File System Traverser Demo (CommonJS) ---');

    // 1. Define a temporary directory for testing
    const TEMP_DIR = resolve('./temp_traversal_root');
    const ROOT_FILE = join(TEMP_DIR, 'root_config.json');
    const SUB_DIR_A = join(TEMP_DIR, 'src');
    const SUB_DIR_B = join(SUB_DIR_A, 'components');
    const FILE_A = join(SUB_DIR_A, 'app.js');
    const FILE_B = join(SUB_DIR_B, 'button.jsx');
    const FILE_C = join(SUB_DIR_B, 'readme.md');

    // 2. Setup: Create the dummy directory structure and files
    try {
        console.log(`\nSetting up dummy structure at: ${TEMP_DIR}`);
        await fs.mkdir(SUB_DIR_B, { recursive: true });
        // Write content to files to give them a non-zero size for the size command test
        await fs.writeFile(ROOT_FILE, JSON.stringify({ version: '1.0' })); // ~20 bytes
        await fs.writeFile(FILE_A, 'console.log("app");'.repeat(10)); // ~200 bytes
        await fs.writeFile(FILE_B, 'export default function Button() {};'); // ~35 bytes
        await fs.writeFile(FILE_C, '# Component Readme'); // ~18 bytes

    } catch (e) {
        console.error("Setup failed:", e.message);
        return;
    }


    // ====================================================================
    // TEST 3: Run a Command for a Directory (Calculate Total Size)
    // ====================================================================
    console.log('\n========================================================');
    console.log('TEST 3: Run Command - Calculate Directory Size (byte count)');
    console.log('========================================================');

    try {
        const sizeInBytes = await getDirectorySize(TEMP_DIR);
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        console.log(`\nTotal Size of ${path.basename(TEMP_DIR)}:`);
        console.log(`\t- \x1b[36m${sizeInBytes}\x1b[0m bytes`); // Cyan
        console.log(`\t- \x1b[36m${sizeInKB}\x1b[0m KB (approx)`);
    } catch (e) {
        console.error("Traversal Test 3 failed:", e.message);
    }


    // 4. Cleanup: Remove the temporary directory
    try {
        console.log('\n--- Cleaning up temporary files ---');
        await fs.rm(TEMP_DIR, { recursive: true, force: true });
        console.log('Cleanup complete. Directory structure removed.');
    } catch (e) {
        console.error("Cleanup failed:", e.message);
    }
}

main()