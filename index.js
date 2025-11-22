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
async function traversePath(currentPath, callback, shouldRecurse = true) {
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

            // needed if inside assignation or argument for function
            // shouldRecurse = false;
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


// ----------------------------------------------------------------------
// 4. getNestedStructure: Tree Building Function
// ----------------------------------------------------------------------
/**
 * Recursively traverses a file system path and returns the result as a nested array (tree structure).
 * Each node in the tree is an object: { name, fullPath, isDirectory, children: []|null }.
 *
 * @param {string} rootPath - The starting path to build the tree from.
 * @returns {Promise<object[]|null>} - A promise that resolves to the array of child nodes of the root path,
 * or null if the root path is inaccessible.
 */
async function getNestedStructure(rootPath) {
    const fullRootPath = resolve(rootPath);
    // Map to store nodes by full path for O(1) parent lookup
    const pathMap = new Map();

    // 1. Initialize the root node manually (since traversePath excludes the root itself)
    let rootNode;
    try {
        const stats = await fs.stat(fullRootPath);
        rootNode = {
            // Use base name for display, or full path if it's the root of the file system
            name: path.basename(fullRootPath) || fullRootPath,
            fullPath: fullRootPath,
            isDirectory: stats.isDirectory(),
            children: []
        };
        // Store the root node so children can attach to it
        pathMap.set(fullRootPath, rootNode);
    } catch (e) {
        console.error(`Error initializing root path ${fullRootPath}: ${e.message}`);
        return null;
    }

    // Callback function to build the tree structure
    const treeBuilderCallback = async (fullPath, name, isDirectory) => {
        // Find the parent's full path
        const parentPath = path.dirname(fullPath);

        // Create the current node structure
        const currentNode = {
            name: name,
            fullPath: fullPath,
            isDirectory: isDirectory,
            children: isDirectory ? [] : null // Only directories have children
        };

        // 2. Add current node to the map for future lookups (when it becomes a parent)
        pathMap.set(fullPath, currentNode);

        // 3. Append the current node to its parent's children array
        const parentNode = pathMap.get(parentPath);
        if (parentNode && parentNode.children) {
            parentNode.children.push(currentNode);
        }

        return true; // Always continue traversal
    };

    // Use the core traversePath function to populate the structure
    await traversePath(fullRootPath, treeBuilderCallback);

    // Return the array of nodes directly under the root path
    return rootNode.children;
}

// // ----------------------------------------------------------------------
// // 1. flattenStructureToPaths: Converts Tree Object to Flat Path Array
// // ----------------------------------------------------------------------
// /**
//  * Recursively traverses a nested object representing a file/directory structure
//  * and returns a flattened array of all file paths.
//  *
//  * The structure is expected to use:
//  * - Object values ({}) for directories.
//  * - Empty string values ("") for files.
//  *
//  * @param {object} fileStructure - The current directory contents object.
//  * @param {string} [currentPath=''] - The path built up so far (used for recursion).
//  * @returns {string[]} - A list of fully qualified file paths (strings).
//  */
// function flattenStructureToPaths(fileStructure, currentPath = '') {
//     const allPaths = [];

//     // Check if the input is a valid object (directory)
//     if (typeof fileStructure !== 'object' || fileStructure === null || Array.isArray(fileStructure)) {
//         return allPaths;
//     }

//     // Iterate over the properties (names) of the current directory level
//     for (const name in fileStructure) {
//         if (fileStructure.hasOwnProperty(name)) {
//             const content = fileStructure[name];

//             // Construct the full path for the current item
//             const fullPath = join(currentPath, name);

//             if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
//                 // Case 1: If content is an object, it's a directory.
//                 // Recursively call the function and merge the results.
//                 const subPaths = flattenStructureToPaths(content, fullPath);
//                 allPaths.push(...subPaths);
//             } else if (content === "") {
//                 // Case 2: If content is an empty string, it's a file.
//                 allPaths.push(fullPath);
//             }
//             // Other types are ignored, maintaining the strict file/dir structure.
//         }
//     }

//     return allPaths;
// }

// ----------------------------------------------------------------------
// 2. getDirectorySize: Calculates the total size of files in a directory tree.
// ----------------------------------------------------------------------

/**
 * Calculates the total size (in bytes) of all files within a directory and its subdirectories.
 *
 * @param {string} rootPath - The starting directory path.
 * @returns {Promise<number>} A promise resolving to the total size in bytes.
 */
async function getDirectorySize(rootPath) {
    let totalSize = 0;

    const sizeCallback = async (fullPath, name, isDir) => {
        if (!isDir) {
            try {
                const stats = await fs.stat(fullPath);
                totalSize += stats.size;
            } catch (error) {
                console.error(`Error accessing entry ${fullPath}: ${error.message}`);
            }
        }
        return true; // Always continue traversal
    };

    await traversePath(rootPath, sizeCallback);
    return totalSize;
}

// ----------------------------------------------------------------------
// 3. traverseFS: Encapsulated file/dir search utility.
// ----------------------------------------------------------------------

/**
 * Searches for specific files and/or directories within a root path (or array of paths).
 *
 * @param {string|string[]} rootPaths - The starting path(s).
 * @param {{targetFile?: string, targetDir?: string}} searchConfig - Configuration object for file/dir names to find.
 * @param {Function} [userCallback] - Optional callback (fullPath, name, isDir) to run on successful match.
 * @returns {Promise<{filesFound: string[], dirsFound: string[]}>}
 */
async function traverseFS(rootPaths, searchConfig, userCallback = async () => { }) {
    const filesFound = [];
    const dirsFound = [];

    const searchCallback = async (fullPath, name, isDir) => {
        let isMatch = false;

        if (!isDir && searchConfig.targetFile === name) {
            filesFound.push(fullPath);
            isMatch = true;
        } else if (isDir && searchConfig.targetDir === name) {
            dirsFound.push(fullPath);
            isMatch = true;
        }

        if (isMatch) {
            try {
                await userCallback(fullPath, name, isDir);
            } catch (error) {
                console.error(`Error in user callback within traverseFS for ${fullPath}: ${error.message}`);
            }
        }
        return true; // Always continue searching
    };

    const pathsToTraverse = Array.isArray(rootPaths) ? rootPaths : [rootPaths];

    for (const p of pathsToTraverse) {
        await traversePath(p, searchCallback);
    }

    return { filesFound, dirsFound };
}


// ====================================================================
// NESTED STRUCTURE BUILDING (from previous interactions)
// ====================================================================

/**
 * Recursive Helper for File System Traversal (Used by getNestedStructure)
 *
 * @param {string} currentDirPath - The current directory to traverse.
 * @returns {Promise<Array<object>>} - A promise resolving to an array of Node objects.
 */
async function buildStructure(currentDirPath) {
    try {
        const entries = await fs.readdir(currentDirPath, { withFileTypes: true });

        const children = [];
        for (const entry of entries) {
            // Ignore hidden files (dot files)
            if (entry.name.startsWith('.')) continue;

            const fullPath = join(currentDirPath, entry.name);
            const isDir = entry.isDirectory();

            if (isDir) {
                // Recursively build children structure
                const grandChildren = await buildStructure(fullPath);
                children.push(Node(entry.name, fullPath, true, grandChildren));
            } else {
                // File node
                children.push(Node(entry.name, fullPath, false));
            }
        }
        return children;

    } catch (error) {
        // Log error accessing this specific path and return an empty array, allowing traversal to continue higher up.
        console.error(`Error accessing path ${currentDirPath}: ${error.message}`);
        return [];
    }
}

/**
 * Recursively traverses a file system path and builds a nested JSON structure.
 *
 * @param {string} rootPath - The starting directory path.
 * @returns {Promise<Array<object> | null>} A promise that resolves to an array of file/directory nodes (children of root), or null on failure.
 */
async function getNestedStructure(rootPath) {
    try {
        const stats = await fs.stat(rootPath);
        if (!stats.isDirectory()) {
            console.error(`Error initializing root path: ${rootPath} is not a directory.`);
            return null;
        }

        // The root itself is not included, only its children are returned.
        const structure = await buildStructure(rootPath);
        return structure;

    } catch (error) {
        console.error(`Error initializing root path: ${error.message}`);
        return null;
    }
}


// ====================================================================
// IN-MEMORY STRUCTURE TRAVERSAL
// ====================================================================

/**
 * Recursively traverses a nested object representing a file/directory structure
 * and returns a flattened array of all file paths.
 * (Operates on in-memory objects, not the real filesystem)
 *
 * @param {object} fileStructure - The current directory contents object.
 * @param {string} [currentPath=''] - The path built up so far (used for recursion).
 * @returns {string[]} - A list of fully qualified file paths (strings).
 */
function flattenStructureToPaths(fileStructure, currentPath = '') {
    const allPaths = [];

    if (typeof fileStructure !== 'object' || fileStructure === null || Array.isArray(fileStructure)) {
        return allPaths;
    }

    for (const name in fileStructure) {
        if (fileStructure.hasOwnProperty(name)) {
            const content = fileStructure[name];
            const fullPath = join(currentPath, name);

            if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
                const subPaths = flattenStructureToPaths(content, fullPath);
                allPaths.push(...subPaths);
            } else if (content === "") {
                allPaths.push(fullPath);
            }
        }
    }

    return allPaths;
}


/**
 * path-reducer.js
 * * Utility function to process an array of file paths sequentially
 * using an asynchronous reducer function.
 */

// ----------------------------------------------------------------------
// Core Utility Function
// ----------------------------------------------------------------------

/**
 * Sequentially processes an array of paths using an asynchronous reducer function.
 * * This implementation is robust against asynchronous operations within the 
 * reducer, ensuring each step completes before the next path is processed.
 *
 * @param {string[]} paths - The array of paths to process.
 * @param {Function} reducerFunction - The async function to execute on each path.
 * Signature: (accumulator, currentPath, index, array) => Promise<any>
 * @param {any} initialValue - The initial value for the accumulator.
 * @returns {Promise<any>} A promise that resolves to the final accumulated value.
 */
async function processPathsWithReducer(paths, reducerFunction, initialValue) {
    if (!Array.isArray(paths)) {
        throw new Error('The "paths" argument must be an array.');
    }

    // Use reduce to iterate sequentially and handle asynchronous logic
    // We initialize the accumulator with Promise.resolve(initialValue) 
    // to start the promise chain.
    return paths.reduce(async (accumulatorPromise, currentPath, index, array) => {
        // 1. Wait for the accumulator (the result of the previous step) to resolve
        const accumulator = await accumulatorPromise;

        // 2. Execute the user's asynchronous reducer function
        // Note: The reducerFunction itself must return a Promise (or an async function)
        const nextAccumulator = await reducerFunction(accumulator, currentPath, index, array);

        // 3. Return the new promise chain link
        return nextAccumulator;
    }, Promise.resolve(initialValue)); // Start with a resolved promise of the initial value
}


// ----------------------------------------------------------------------
// Example Usage
// ----------------------------------------------------------------------

// Example: Simulating a slow file processing operation (e.g., calculating checksums)
// change the below function to run on every file path or entry
// 
async function simulateProcessFile(path) {
    // Simulate a network/disk delay
    await new Promise(resolve => setTimeout(resolve, 50));
    const result = `Processed_${path.toUpperCase()}`;
    console.log(`\t-> Finished: ${path}`);
    return result;
}

// Example Reducer: Count and concatenate the results of processing all paths
async function pathReducer(processedResults, currentPath, index) {
    console.log(`Starting path ${index + 1}: ${currentPath}`);

    // Call the simulated async operation
    const result = await simulateProcessFile(currentPath);

    // Accumulate the result
    processedResults.count++;
    processedResults.log.push(result);

    return processedResults;
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
    // main();
}

// Export the main function and utility for use as a library
module.exports = {
    traversePath,
    getDirectorySize,
    traverseFS,
    dir: traversePath, 
    search: traverseFS,
    getNestedStructure, 
    buildStructure, 
    flattenStructureToPaths,
    processPathsWithReducer,
};

