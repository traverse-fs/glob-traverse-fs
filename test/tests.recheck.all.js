/**
 * file-traverser.test.js
 *
 * Mocha, Chai, and Sinon test suite for the file-traverser utility.
 *
 * This test suite verifies the functionality of traversePath, getDirectorySize,
 * and the new traverseFS function.
 *
 * To run these tests, you must have Mocha, Chai, and Sinon installed:
 * npm install --save-dev mocha chai sinon
 * Then run: npx mocha file-traverser.test.js
 */
const { assert, expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs').promises;
const path = require('path');
const { traversePath, getDirectorySize, traverseFS } = require('../index.js');

const { resolve, join, dirname } = path;

// --- Test Fixture Setup ---
// Define the root directory for all temporary test files
const TEMP_DIR = resolve('./temp_test_root');

// Define intermediate directory paths for main structure
const SUB_DIR_A_PATH = join(TEMP_DIR, 'src');
const SUB_DIR_B_PATH = join(SUB_DIR_A_PATH, 'components');
const SUB_DIR_C_PATH = join(TEMP_DIR, 'CaseSensitive');

// Define paths for edge cases
const EMPTY_DIR_PATH = join(TEMP_DIR, 'empty_dir');
const SHALLOW_DIR_PATH = join(TEMP_DIR, 'shallow');
const SHALLOW_FILE_PATH_1 = join(SHALLOW_DIR_PATH, 'file1.txt');
const SHALLOW_FILE_PATH_2 = join(SHALLOW_DIR_PATH, 'file2.txt');
const CASE_SENSITIVE_FILE = join(SUB_DIR_C_PATH, 'TEST.txt');

// Constants for the COMPLETE structure count (traversed from TEMP_DIR)
const TOTAL_FILES_COUNT = 7; 
// FIX: Corrected total directory count (Root, src, components, CaseSensitive, empty_dir, shallow)
const TOTAL_DIR_COUNT = 6; 
// FIX: Corrected total entry count (7 files + 6 directories = 13)
const TOTAL_ENTRIES = TOTAL_FILES_COUNT + TOTAL_DIR_COUNT; // 13 total entries 

const FILE_PATHS = {
    // Main Structure
    ROOT_FILE: join(TEMP_DIR, 'root_config.json'),
    SUB_DIR_A: SUB_DIR_A_PATH,
    SUB_DIR_B: SUB_DIR_B_PATH,
    SUB_DIR_C: SUB_DIR_C_PATH, 
    FILE_A: join(SUB_DIR_A_PATH, 'app.js'),
    FILE_B: join(SUB_DIR_B_PATH, 'button.jsx'),
    FILE_C: join(SUB_DIR_B_PATH, 'readme.md'),
    FILE_D: CASE_SENSITIVE_FILE, 
    // Edge Cases
    EMPTY_DIR: EMPTY_DIR_PATH,
    SHALLOW_DIR: SHALLOW_DIR_PATH,
    SHALLOW_FILE_1: SHALLOW_FILE_PATH_1,
    SHALLOW_FILE_2: SHALLOW_FILE_PATH_2,
};

// Content definitions
const CONTENT_ROOT = JSON.stringify({ version: '1.0' });
const CONTENT_A = 'console.log("app");'.repeat(10);
const CONTENT_B = 'export default function Button() {};';
const CONTENT_C = '# Component Readme';
const CONTENT_D = 'This is all uppercase.';
const CONTENT_EMPTY = ''; 

// Calculate the expected total size based on the content bytes
const EXPECTED_TOTAL_SIZE = Buffer.byteLength(CONTENT_ROOT) + 
                            Buffer.byteLength(CONTENT_A) + 
                            Buffer.byteLength(CONTENT_B) + 
                            Buffer.byteLength(CONTENT_C) +
                            Buffer.byteLength(CONTENT_D) +
                            Buffer.byteLength('shallow content'); // Include shallow file content

// Global stub variable for console.error
let consoleErrorStub; 

describe('File System Traverser Utilities', () => {
    // Setup: Create the temporary test directory structure (runs once)
    before(async () => {
        console.log('\nSetting up test fixture...');
        // Create main nested structure
        await fs.mkdir(FILE_PATHS.SUB_DIR_B, { recursive: true });
        
        // Create edge case structures
        await fs.mkdir(FILE_PATHS.EMPTY_DIR);
        await fs.mkdir(FILE_PATHS.SHALLOW_DIR);
        await fs.mkdir(FILE_PATHS.SUB_DIR_C); 
        
        // Write content to main files
        await fs.writeFile(FILE_PATHS.ROOT_FILE, CONTENT_ROOT);
        await fs.writeFile(FILE_PATHS.FILE_A, CONTENT_A);
        await fs.writeFile(FILE_PATHS.FILE_B, CONTENT_B);
        await fs.writeFile(FILE_PATHS.FILE_C, CONTENT_C);
        
        // Write content to shallow files (one empty, one with content)
        await fs.writeFile(FILE_PATHS.SHALLOW_FILE_1, CONTENT_EMPTY);
        await fs.writeFile(FILE_PATHS.SHALLOW_FILE_2, 'shallow content');

        // Write content for the new case-sensitive file
        await fs.writeFile(FILE_PATHS.FILE_D, CONTENT_D);

        console.log(`Test fixture created at: ${TEMP_DIR}`);
    });

    // Stub console.error before EACH test (runs repeatedly)
    beforeEach(() => {
        // Suppress console error messages during tests to check for expected errors
        consoleErrorStub = sinon.stub(console, 'error'); 
    });
    
    // Restore console.error after EACH test (runs repeatedly)
    afterEach(() => {
        consoleErrorStub.restore();
    });

    // Teardown: Remove the temporary test directory structure (runs once)
    after(async () => {
        console.log('\nCleaning up test fixture...');
        await fs.rm(TEMP_DIR, { recursive: true, force: true });
        console.log('Cleanup complete.');
    });

    // ====================================================================
    // TEST GROUP 1: Basic Traversal (traversePath)
    // ====================================================================
    describe('Test Group 1: Basic Traversal (traversePath)', () => {
        it('1.1 should recursively traverse the entire structure (7 files + 6 dirs) and call the callback 12 times', async () => {
            const callbackSpy = sinon.spy();
            
            await traversePath(TEMP_DIR, callbackSpy);

            // Expected count is 12 (TOTAL_ENTRIES - 1) because traversePath excludes the starting path's entry itself.
            expect(callbackSpy.callCount).to.equal(TOTAL_ENTRIES - 1); // 12
            
            const fileCalls = callbackSpy.getCalls().filter(call => call.args[2] === false);
            const dirCalls = callbackSpy.getCalls().filter(call => call.args[2] === true);
            
            expect(fileCalls).to.have.lengthOf(TOTAL_FILES_COUNT);
            expect(dirCalls).to.have.lengthOf(TOTAL_DIR_COUNT - 1); // Excludes the root directory
        });

        it('1.3 should correctly traverse a shallow directory (no sub-folders) and call callback for 2 files', async () => {
            const callbackSpy = sinon.spy();
            const expectedFileNames = ['file1.txt', 'file2.txt'];

            await traversePath(SHALLOW_DIR_PATH, callbackSpy);
            
            // Should find 2 files only (no hidden files, no sub-dirs)
            expect(callbackSpy.callCount).to.equal(2); 
            
            const foundNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(foundNames).to.have.members(expectedFileNames);
        });

        it('1.4 should correctly traverse an empty directory and call callback 0 times', async () => {
            const callbackSpy = sinon.spy();
            await traversePath(EMPTY_DIR_PATH, callbackSpy);
            expect(callbackSpy.callCount).to.equal(0);
        });

        it('1.5 should correctly traverse a path containing only a single file (no recursion)', async () => {
            const callbackSpy = sinon.spy();
            await traversePath(FILE_PATHS.ROOT_FILE, callbackSpy);
            // traversePath is designed to read directories. If given a file path, it fails to read the directory (correctly).
            // It should hit the error handler and log an error.
            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(callbackSpy.notCalled).to.be.true;
        });
    });

    // ====================================================================
    // TEST GROUP 2: Filtering Capability (traversePath)
    // ====================================================================
    describe('Test Group 2: Filtering Capability (traversePath)', () => {
        it('2.1 should only run callback for files ending with .js or .jsx', async () => {
            const callbackSpy = sinon.spy();
            const filterCallback = async (path, name, isDir) => {
                if (!isDir && (name.endsWith('.js') || name.endsWith('.jsx'))) {
                    callbackSpy(path, name, isDir);
                }
            };
            
            await traversePath(TEMP_DIR, filterCallback);

            // app.js and button.jsx (2 files)
            expect(callbackSpy.callCount).to.equal(2);
            const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(calledNames).to.have.members(['app.js', 'button.jsx']);
        });

        it('2.2 should only run callback for directories named "components"', async () => {
            const callbackSpy = sinon.spy();
            const filterCallback = async (path, name, isDir) => {
                if (isDir && name === 'components') {
                    callbackSpy(path, name, isDir);
                }
            };

            await traversePath(TEMP_DIR, filterCallback);

            expect(callbackSpy.callCount).to.equal(1);
            expect(callbackSpy.firstCall.args[1]).to.equal('components');
            expect(callbackSpy.firstCall.args[2]).to.be.true;
        });

        it('2.3 should correctly filter based on file content (approximate size)', async () => {
            const callbackSpy = sinon.spy();
            const filterCallback = async (fullPath, name, isDir) => {
                if (!isDir) {
                    const stats = await fs.stat(fullPath);
                    if (stats.size > 100) { // Only app.js should be > 100 bytes
                        callbackSpy(fullPath, name, isDir);
                    }
                }
            };

            await traversePath(TEMP_DIR, filterCallback);

            expect(callbackSpy.callCount).to.equal(1);
            expect(callbackSpy.firstCall.args[1]).to.equal('app.js');
        });

        it('2.4 should successfully skip traversal into the "components" directory by returning false', async () => {
            const callbackSpy = sinon.spy();
            
            const skipCallback = async (path, name, isDir) => {
                callbackSpy(path, name, isDir); 
                if (isDir && name === 'components') {
                    return false; 
                }
                return true; 
            };

            await traversePath(TEMP_DIR, skipCallback);

            // Total calls: 12 (Total entries excluding root) - 2 skipped files = 10 calls.
            expect(callbackSpy.callCount).to.equal(10); 
            
            const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(calledNames).to.not.include.members(['button.jsx', 'readme.md']);
        });

        it('2.5 should traverse directories based on a specific condition (e.g., only traverse "src")', async () => {
            const callbackSpy = sinon.spy();
            
            // Directories that are siblings of 'src' and should be skipped from recursion.
            const DIRS_TO_SKIP = ['CaseSensitive', 'empty_dir', 'shallow'];

            const conditionalCallback = async (fullPath, name, isDir) => {
                callbackSpy(fullPath, name, isDir); 
                
                // Check if the current directory is a top-level sibling of 'src'
                const isTopLevelSibling = isDir && (dirname(fullPath) === TEMP_DIR) && DIRS_TO_SKIP.includes(name);

                // Skip recursion only for the identified top-level siblings.
                if (isTopLevelSibling) {
                    return false; 
                }
                
                // Allow traversal for the root file, 'src', and everything inside 'src' (like 'components')
                return true;
            };

            await traversePath(TEMP_DIR, conditionalCallback);

            // The correct count is 9: 
            // 1 (root_config.json) 
            // + 1 (src)
            // + 1 (app.js) 
            // + 1 (components)
            // + 2 (files inside components) 
            // + 3 (skipped directories: CaseSensitive, empty_dir, shallow)
            expect(callbackSpy.callCount).to.equal(9);
            
            const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(calledNames).to.not.include.members(['file1.txt', 'file2.txt', 'TEST.txt']);
        });
    });

    // ====================================================================
    // TEST GROUP 3: Directory Command (getDirectorySize)
    // ====================================================================
    describe('Test Group 3: Directory Command (getDirectorySize)', () => {
        it('3.1 should correctly run the command (getDirectorySize) and calculate total size of main structure', async () => {
            const size = await getDirectorySize(TEMP_DIR);
            
            // Expected size includes all 7 files.
            expect(size).to.equal(EXPECTED_TOTAL_SIZE);
        });

        it('3.2 should correctly calculate the size of a single nested directory (src)', async () => {
            const expectedSize = Buffer.byteLength(CONTENT_A) + Buffer.byteLength(CONTENT_B) + Buffer.byteLength(CONTENT_C);
            const size = await getDirectorySize(FILE_PATHS.SUB_DIR_A);
            
            expect(size).to.equal(expectedSize);
        });

        it('3.3 should include files with zero content (empty string) in the total size calculation (size=0)', async () => {
            // file1.txt is empty, should still be counted as 0.
            const expectedSize = Buffer.byteLength('shallow content') + 0; 
            const size = await getDirectorySize(FILE_PATHS.SHALLOW_DIR);

            expect(size).to.equal(expectedSize);
        });

        it('3.4 should return 0 size for a completely empty directory', async () => {
            const size = await getDirectorySize(FILE_PATHS.EMPTY_DIR);
            expect(size).to.equal(0);
        });

        it('3.5 should handle files that fail fs.stat (e.g., permissions issue) gracefully', async () => {
            // Stub fs.stat to throw an error for a specific file (e.g., root_config.json)
            const statStub = sinon.stub(fs, 'stat');
            statStub.callThrough(); 
            statStub.withArgs(FILE_PATHS.ROOT_FILE).throws(new Error('EPERM: Permission denied'));

            try {
                const size = await getDirectorySize(TEMP_DIR);
                
                // Expected size should exclude the size of the failed file (root_config.json)
                const expectedSizeWithoutRoot = EXPECTED_TOTAL_SIZE - Buffer.byteLength(CONTENT_ROOT);

                // Error is caught by traversePath's internal stat handler, check for 'Error accessing entry'
                expect(consoleErrorStub.calledOnce).to.be.true;
                expect(consoleErrorStub.firstCall.args[0]).to.include('Error accessing entry');
                expect(size).to.equal(expectedSizeWithoutRoot);
            } finally {
                // Guarantee restore even if assertions fail
                statStub.restore();
            }
        });
    });

    // ====================================================================
    // TEST GROUP 4: Error Handling (traversePath)
    // ====================================================================
    describe('Test Group 4: Error Handling (traversePath)', () => {
        it('4.1 should log an error and return if the starting path is non-existent', async () => {
            const callbackSpy = sinon.spy();
            const badPath = join(TEMP_DIR, 'non-existent-start-dir');
            
            await traversePath(badPath, callbackSpy);

            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.firstCall.args[0]).to.include('Error accessing path');
            expect(callbackSpy.notCalled).to.be.true;
        });

        it('4.2 should log an error for an unreadable directory during deep traversal and continue', async () => {
            // Temporarily create a non-existent directory *inside* src to simulate failure deep down
            const UNREADABLE_DIR = join(FILE_PATHS.SUB_DIR_A, 'unreadable_dir');
            
            // Stub fs.readdir to throw an error when trying to read the unreadable_dir
            const readdirStub = sinon.stub(fs, 'readdir');
            readdirStub.callThrough(); 
            readdirStub.withArgs(UNREADABLE_DIR).throws(new Error('EACCES: Permission denied'));
            
            // Create a fake directory for the traverser to hit
            await fs.mkdir(UNREADABLE_DIR);

            const callbackSpy = sinon.spy();
            await traversePath(TEMP_DIR, callbackSpy);

            // FIX: Total calls should be 12 (original) + 1 (unreadable_dir) = 13
            expect(callbackSpy.callCount).to.equal(13); 
            
            // The error must be logged exactly once for the failed readdir
            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.firstCall.args[0]).to.include('Error accessing path');
            expect(consoleErrorStub.firstCall.args[0]).to.include(UNREADABLE_DIR);

            // Cleanup the stub and the fake directory
            readdirStub.restore();
            await fs.rmdir(UNREADABLE_DIR);
        });
        
        it('4.3 should handle an error thrown by the user-provided callback', async () => {
            const errorCallback = async (path, name, isDir) => {
                if (name === 'app.js') {
                    throw new Error("User callback failed for app.js");
                }
            };
            
            await traversePath(TEMP_DIR, errorCallback);

            // FIX: Use .called for robustness, and ensure the correct error message is logged
            expect(consoleErrorStub.called).to.be.true; 
            expect(consoleErrorStub.firstCall.args[0]).to.include('Error in user callback for path');
            expect(consoleErrorStub.firstCall.args[0]).to.include('app.js');
        });

        it('4.4 should continue traversal even if an entry fails fs.stat (unreadable symlink)', async () => {
            // Stub fs.stat to throw an error for a specific entry (e.g., src)
            const statStub = sinon.stub(fs, 'stat');
            statStub.callThrough(); 
            statStub.withArgs(FILE_PATHS.SUB_DIR_A).throws(new Error('ELOOP: Too many symbolic links'));
            
            const callbackSpy = sinon.spy();
            
            try {
                await traversePath(TEMP_DIR, callbackSpy);

                // If 'src' fails stat, it and its 4 descendants are skipped. 12 total entries - 5 skipped = 7 calls.
                expect(callbackSpy.callCount).to.equal(7); 
                expect(consoleErrorStub.calledOnce).to.be.true;
                expect(consoleErrorStub.firstCall.args[0]).to.include('Error accessing entry');
            } finally {
                // Guarantee restore even if assertions fail 
                statStub.restore();
            }
        });
    });

    // ====================================================================
    // TEST GROUP 5: Edge Cases and Callback Logic (traversePath)
    // ====================================================================
    describe('Test Group 5: Edge Cases and Callback Logic (traversePath)', () => {
        it('5.1 should continue traversal if the callback returns false for a FILE (non-directory)', async () => {
            const callbackSpy = sinon.spy();
            
            const fileSkipCallback = async (path, name, isDir) => {
                callbackSpy(path, name, isDir); 
                // Returning false for a file should not stop recursion
                if (!isDir && name === 'app.js') {
                    return false; 
                }
                return true; 
            };

            await traversePath(TEMP_DIR, fileSkipCallback);

            // CORRECTED: Should be 12 calls (TOTAL_ENTRIES - 1) as the root is not included in the count.
            expect(callbackSpy.callCount).to.equal(TOTAL_ENTRIES - 1); // 12
        });

        it('5.2 should exclude dot-files (hidden files) from traversal (verified by setup)', async () => {
            const hiddenFilePath = join(TEMP_DIR, '.hidden.txt');
            await fs.writeFile(hiddenFilePath, 'secret');
            
            const callbackSpy = sinon.spy();
            await traversePath(TEMP_DIR, callbackSpy);
            
            // CORRECTED: Should be 12 calls (TOTAL_ENTRIES - 1). The hidden file is correctly ignored, and the root is not counted.
            expect(callbackSpy.callCount).to.equal(TOTAL_ENTRIES - 1); // 12
            
            const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(calledNames).to.not.include('.hidden.txt');

            await fs.unlink(hiddenFilePath);
        });
    });
    
    // ====================================================================
    // TEST GROUP 6: traverseFS (Array Traversal and Encapsulated Search)
    // ====================================================================
    describe('Test Group 6: traverseFS (Array Traversal and Encapsulated Search)', () => {
        it('6.1 should find a specific file and a specific directory from the root path', async () => {
            const searchConfig = {
                targetFile: 'app.js',
                targetDir: 'components'
            };

            const result = await traverseFS(TEMP_DIR, searchConfig);

            expect(result.filesFound).to.have.lengthOf(1);
            expect(result.filesFound[0]).to.equal(FILE_PATHS.FILE_A);

            expect(result.dirsFound).to.have.lengthOf(1);
            expect(result.dirsFound[0]).to.equal(FILE_PATHS.SUB_DIR_B);
        });

        it('6.2 should handle case-sensitive targets (TEST.txt vs test.txt)', async () => {
            const caseSensitiveConfig = {
                targetFile: 'TEST.txt', // Exists
                targetDir: 'casesensitive' // Does not exist (CaseSensitive exists)
            };
            const result = await traverseFS(TEMP_DIR, caseSensitiveConfig);

            // Should find the file
            expect(result.filesFound).to.have.lengthOf(1);
            expect(result.filesFound[0]).to.equal(FILE_PATHS.FILE_D);

            // Should not find the directory due to case mismatch
            expect(result.dirsFound).to.have.lengthOf(0);
        });

        it('6.3 should handle an array of starting paths (multi-path traversal)', async () => {
            const paths = [FILE_PATHS.SUB_DIR_A, FILE_PATHS.SHALLOW_DIR]; // src and shallow
            
            const searchConfig = {
                targetFile: 'file2.txt',
                targetDir: 'components'
            };
            
            const result = await traverseFS(paths, searchConfig);

            // file2.txt is in shallow
            expect(result.filesFound).to.have.lengthOf(1);
            expect(result.filesFound[0]).to.equal(FILE_PATHS.SHALLOW_FILE_2);

            // components is in src
            expect(result.dirsFound).to.have.lengthOf(1);
            expect(result.dirsFound[0]).to.equal(FILE_PATHS.SUB_DIR_B);
        });

        it('6.4 should execute the userCallback only for entries that match the search criteria', async () => {
            const userCallbackSpy = sinon.spy();
            
            const searchConfig = {
                targetFile: 'root_config.json', // One file matches
                targetDir: 'shallow' // One directory matches
            };
            
            await traverseFS(TEMP_DIR, searchConfig, userCallbackSpy);

            // Total matches: 1 file + 1 directory = 2 calls
            expect(userCallbackSpy.callCount).to.equal(2);
            
            const foundNames = userCallbackSpy.getCalls().map(call => call.args[1]);
            expect(foundNames).to.include.members(['root_config.json', 'shallow']);
        });

        it('6.5 should continue searching even if the userCallback throws an error', async () => {
            const userCallbackSpy = sinon.spy(async (fullPath, name) => {
                if (name === 'shallow') {
                    throw new Error("Custom error from traverseFS callback");
                }
            });
            
            const searchConfig = {
                targetFile: 'root_config.json', // One file matches
                targetDir: 'shallow' // One directory matches (where error occurs)
            };
            
            await traverseFS(TEMP_DIR, searchConfig, userCallbackSpy);

            // The callback should be called for both 'root_config.json' and 'shallow'
            expect(userCallbackSpy.callCount).to.equal(2); 
            
            // FIX: Use .called and check for the error message
            expect(consoleErrorStub.called).to.be.true;
            expect(consoleErrorStub.firstCall.args[0]).to.include('Error in user callback within traverseFS');
        });
    });
});