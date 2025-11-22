/**
 * file-traverser.js
 *
 * A lightweight, recursive file system traverser for Node.js using CommonJS modules.
 * It uses the 'fs.promises' API for modern asynchronous handling.
 *
 * Exports:
 * 1. traversePath: The core recursive engine with custom callback support.
 * 2. getDirectorySize: A utility built on traversePath to calculate total file size.
 * 3. traverseFS: A utility built on traversePath for multi-path, encapsulated search, 
 * now supporting an optional execution callback.
 */
const fs = require('fs').promises;
const path = require('path');
const { resolve, join } = path;

/**
 * 1. traversePath: The Core Engine (Traverse and Run a Generic Function)
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
        names = names.filter(name => !name.startsWith('.'));

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
                // This is crucial for handling unreadable files/symlinks gracefully.
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
                // Catch errors thrown by the user's callback function.
                console.error(`Error in user callback for path ${entryFullPath}: ${cbError.message}`);
                // Continue traversal after a callback failure
            }

            // 4. If the entry is a directory AND recursion is allowed, recurse into it
            if (isDirectory && shouldRecurse) {
                await traversePath(entryFullPath, callback);
            }
        }

    } catch (error) {
        // Log errors but gracefully exit the traversal if the path is inaccessible (e.g., not a directory).
        console.error(`Error accessing path ${fullPath}: ${error.message}`);
    }
}

// ----------------------------------------------------------------------
// 2. getDirectorySize: Search and Run Function (Specific Task Example)
// ----------------------------------------------------------------------
/**
 * Calculates the total size (in bytes) of all files within a directory and its subdirectories.
 * This is a specific search and run function built on traversePath.
 * * @param {string} dirPath - The directory path to calculate the size of.
 * @returns {Promise<number>} - The total size in bytes.
 */
async function getDirectorySize(dirPath) {
    let totalSize = 0;

    // The callback implementation:
    const sizeCallback = async (path, name, isDir) => {
        if (!isDir) {
            try {
                const stats = await fs.stat(path);
                totalSize += stats.size;
            } catch (e) {
                // Handle file stat errors gracefully
                // This error handler is technically redundant because traversePath handles stat errors
                // and skips the entry, but kept for explicit clarity in a utility function.
                console.error(`Error accessing file for size calculation ${path}: ${e.message}`);
            }
        }
    };

    await traversePath(dirPath, sizeCallback);
    return totalSize;
}

// ----------------------------------------------------------------------
// 3. traverseFS: Encapsulated Search (Specific File/Folder Name)
// ----------------------------------------------------------------------
/**
 * Traverses an array of file system paths, searching for a specific file name 
 * and/or a specific directory name.
 * * @param {string[]|string} paths - An array of starting paths (directories or files) to traverse, 
 * or a single path string.
 * @param {object} searchConfig - Configuration object for the search.
 * @param {string} [searchConfig.targetFile] - The name of the file to search for.
 * @param {string} [searchConfig.targetDir] - The name of the directory to search for.
 * @param {function(string, string, boolean): Promise<any>} [userCallback] - Optional function to run 
 * for any file/folder that matches the search criteria.
 * @returns {Promise<{filesFound: string[], dirsFound: string[]}>} - A promise that resolves to an object 
 * containing arrays of full paths for found files and directories.
 */
async function traverseFS(paths, searchConfig, userCallback) {
    const filesFound = [];
    const dirsFound = [];
    const { targetFile, targetDir } = searchConfig;

    // Normalize input: ensure paths is always an array
    if (!Array.isArray(paths)) {
        paths = [paths];
    }

    // The callback implementation:
    const searchCallback = async (fullPath, name, isDirectory) => {
        let isMatch = false;

        // Check for target file match
        if (!isDirectory && targetFile && name === targetFile) {
            filesFound.push(fullPath);
            isMatch = true;
        }

        // Check for target directory match
        if (isDirectory && targetDir && name === targetDir) {
            dirsFound.push(fullPath);
            isMatch = true;
        }

        // Execute the optional user callback if the entry matched the criteria
        if (isMatch && userCallback) {
            try {
                // Pass the entry details to the user-provided callback
                await userCallback(fullPath, name, isDirectory);
            } catch (cbError) {
                console.error(`Error in user callback within traverseFS for ${fullPath}: ${cbError.message}`);
            }
        }

        // Continue traversal (return true implicitly)
        return true;
    };

    // Iterate over all provided starting paths, using the core traversePath utility
    for (const startingPath of paths) {
        // traversePath handles logging errors for non-existent startingPath
        await traversePath(startingPath, searchCallback);
    }

    // Ensure results are unique
    const uniqueFiles = [...new Set(filesFound)];
    const uniqueDirs = [...new Set(dirsFound)];

    return { filesFound: uniqueFiles, dirsFound: uniqueDirs };
}


// Export the main function and utility for use as a library
module.exports = { traversePath, getDirectorySize, traverseFS };

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
    // main();
}

// Export the main function and utility for use as a library
module.exports = { traversePath, getDirectorySize, traverseFS };

