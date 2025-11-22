/**
 * file-traverser.js
 *
 * A lightweight, recursive file system traverser for Node.js using CommonJS modules.
 * It uses the 'fs.promises' API for modern asynchronous handling.
 */
const fs = require('fs').promises;
const path = require('path');
const { resolve, dirname, join } = path;

/**
 * Recursively traverses a file system path, executing a callback function
 * for every file and directory encountered.
 *
 * @param {string} currentPath - The starting path to traverse.
 * @param {function(string, string, boolean): Promise<any>} callback - The function to run for each entry.
 * The callback receives: (fullPath, name, isDirectory).
 * If the callback returns 'false' for a directory, the traversal into that directory is skipped.
 */
async function traversePath(currentPath, callback) {
    // 1. Resolve the path to ensure it's absolute
    const fullPath = resolve(currentPath);

    try {
        // 2. Read the directory contents, getting only names (strings).
        let names = await fs.readdir(fullPath);

        // Filter out dot-files and hidden entries (e.g., .DS_Store, .git)
        names = names.filter(name => !name.startsWith('.')); // <-- FIX: Filter out hidden files
        
        // 3. Process each entry name
        for (const entryName of names) {
            const entryFullPath = join(fullPath, entryName);
            
            // We rely solely on fs.stat for reliable file/directory type checking.
            let isDirectory = false;
            try {
                const stats = await fs.stat(entryFullPath);
                isDirectory = stats.isDirectory();
            } catch (statError) {
                // If fs.stat fails (e.g., permissions issue, unreadable symlink), log and skip it.
                // This ensures traversal continues (Test 4.2, 4.4).
                console.error(`Error accessing entry ${entryFullPath}: ${statError.message}`);
                continue; 
            }

            let shouldRecurse = true;
            try {
                // Execute the user-provided callback and check its return value
                const result = await callback(entryFullPath, entryName, isDirectory);
                
                // If the callback returns false for a directory, stop recursion here.
                if (result === false && isDirectory) {
                    shouldRecurse = false;
                }
            } catch (cbError) {
                // Catch errors thrown by the user's callback function (Test 4.3).
                console.error(`Error in user callback for path ${entryFullPath}: ${cbError.message}`);
                // Continue traversal after a callback failure
            }

            // 4. If the entry is a directory AND recursion is allowed, recurse into it
            if (isDirectory && shouldRecurse) {
                await traversePath(entryFullPath, callback);
            }
        }

    } catch (error) {
        // Log errors but gracefully exit the traversal if the path is inaccessible (Test 4.1, 4.2).
        console.error(`Error accessing path ${fullPath}: ${error.message}`);
    }
}

// ----------------------------------------------------------------------
// Example Usage and Self-Contained Test
// ----------------------------------------------------------------------

// A utility function used for the "Run a Command" test (Test 3)
async function getDirectorySize(dirPath) {
    let totalSize = 0;

    const sizeCallback = async (path, name, isDir) => {
        // Only calculate size for files, not directories
        if (!isDir) {
            try {
                // Use fs.stat to get file metadata, specifically size
                const stats = await fs.stat(path);
                totalSize += stats.size;
            } catch (e) {
                // If a file cannot be accessed (e.g., permissions or fs.stat failure), skip it (Test 3.5).
                console.error(`Error accessing path ${path}: ${e.message}`);
            }
        }
        // Always return true (or nothing) to continue recursion for size calculation
    };

    await traversePath(dirPath, sizeCallback);
    return totalSize;
}

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

    // ====================================================================
    // TEST 2: Search a Directory (Filtering)
    // ====================================================================
    console.log('\n========================================================');
    console.log('TEST 2: Search Directory for Specific Extensions (.jsx)');
    console.log('========================================================');

    const foundFiles = [];
    const searchCallback = async (path, name, isDir) => {
        if (!isDir && name.endsWith('.jsx')) {
            // Found a match: store it in our results array
            foundFiles.push(path.replace(dirname(TEMP_DIR), '.'));
        }
        // No need for a print statement here, we collect results silently
    };

    try {
        // Start search only in the 'src' subdirectory
        await traversePath(SUB_DIR_A, searchCallback);

        console.log(`\nSearch Complete. Found ${foundFiles.length} JSX files:`);
        foundFiles.forEach(file => console.log(`\t- \x1b[33m${file}\x1b[0m`)); // Yellow
    } catch (e) {
        console.error("Traversal Test 2 failed:", e.message);
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

// Run the demonstration if the file is executed directly (CommonJS check)
if (require.main === module) {
    main();
}

// Export the main function and utility for use as a library
module.exports = { traversePath, getDirectorySize };