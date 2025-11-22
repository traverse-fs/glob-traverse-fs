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
    // TEST 1: Run Callback for Directory/File (General Traversal)
    // ====================================================================
    console.log('\n========================================================');
    console.log('TEST 1: General Traversal with File/Folder Specific Actions');
    console.log('========================================================');

    /**
     * Callback that demonstrates actions specific to files or directories.
     */
    const generalCallback = async (path, name, isDir) => {
        const type = isDir ? 'FOLDER' : 'FILE';
        const colorCode = isDir ? '\x1b[34m' : '\x1b[32m'; // Blue for folders, Green for files
        const resetCode = '\x1b[0m';
        const relativePath = path.replace(dirname(TEMP_DIR), '.');

        if (isDir) {
            // Action for a directory: log a special message for the 'src' folder
            if (name === 'src') {
                console.log(`\n${colorCode}>>> [DIRECTORY ACTION] Initializing project configuration in ${name}${resetCode}`);
            }
        } else if (name.endsWith('.md')) {
             // Action for a file: read content of markdown files
            const content = await fs.readFile(path, 'utf8');
            console.log(`[FILE ACTION] Read ${name}: First 5 chars: "${content.substring(0, 5)}..."`);
        }

        console.log(`${colorCode}--> ${type}:${resetCode}\t${relativePath}`);
    };

    try {
        await traversePath(TEMP_DIR, generalCallback);
    } catch (e) {
        console.error("Traversal Test 1 failed:", e.message);
    }

    
}

main()