/**
 * file-traverser.test.js
 *
 * Mocha, Chai, and Sinon test suite for the traversePath utility.
 *
 * This test suite verifies the functionality of traversePath, including
 * recursive traversal, search/filtering using the callback return value,
 * and robust error handling for common file system issues.
 *
 * To run these tests, you must have Mocha, Chai, and Sinon installed:
 * npm install --save-dev mocha chai sinon
 * Then run: npx mocha file-traverser.test.js
 */
const { assert, expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs').promises;
const path = require('path');
const { traversePath, getDirectorySize } = require('../index.js');

const { resolve, join } = path;

// --- Test Fixture Setup ---
// Define the root directory for all temporary test files
const TEMP_DIR = resolve('./temp_test_root');

// Define intermediate directory paths for main structure
const SUB_DIR_A_PATH = join(TEMP_DIR, 'src');
const SUB_DIR_B_PATH = join(SUB_DIR_A_PATH, 'components');

// Define paths for edge cases
const EMPTY_DIR_PATH = join(TEMP_DIR, 'empty_dir');
const SHALLOW_DIR_PATH = join(TEMP_DIR, 'shallow');
const SHALLOW_FILE_PATH_1 = join(SHALLOW_DIR_PATH, 'file1.txt');
const SHALLOW_FILE_PATH_2 = join(SHALLOW_DIR_PATH, 'file2.txt');

// Constants for the COMPLETE structure count (traversed from TEMP_DIR)
// Files: root_config.json, app.js, button.jsx, readme.md, file1.txt, file2.txt (6 files)
const TOTAL_FILES_COUNT = 6; 
// Dirs: src, components, empty_dir, shallow (4 directories)
const TOTAL_DIR_COUNT = 4; 
const TOTAL_ENTRIES = TOTAL_FILES_COUNT + TOTAL_DIR_COUNT; // 10 total entries

const FILE_PATHS = {
    // Main Structure
    ROOT_FILE: join(TEMP_DIR, 'root_config.json'),
    SUB_DIR_A: SUB_DIR_A_PATH,
    SUB_DIR_B: SUB_DIR_B_PATH,
    FILE_A: join(SUB_DIR_A_PATH, 'app.js'),
    FILE_B: join(SUB_DIR_B_PATH, 'button.jsx'),
    FILE_C: join(SUB_DIR_B_PATH, 'readme.md'),
    // Edge Cases
    EMPTY_DIR: EMPTY_DIR_PATH,
    SHALLOW_DIR: SHALLOW_DIR_PATH,
    SHALLOW_FILE_1: SHALLOW_FILE_PATH_1,
    SHALLOW_FILE_2: SHALLOW_FILE_PATH_2,
};

// Content and Size Calculation
const CONTENT_ROOT = JSON.stringify({ version: '1.0' });
const CONTENT_A = 'console.log("app");'.repeat(10);
const CONTENT_B = 'export default function Button() {};';
const CONTENT_C = '# Component Readme';
const CONTENT_EMPTY = ''; // For zero-byte file test

// Calculate the expected total size based on the content bytes
const EXPECTED_TOTAL_SIZE = Buffer.byteLength(CONTENT_ROOT) + 
                            Buffer.byteLength(CONTENT_A) + 
                            Buffer.byteLength(CONTENT_B) + 
                            Buffer.byteLength(CONTENT_C);

// Global stub variable for console.error
let consoleErrorStub; 

describe('traversePath Utility', () => {
    // Setup: Create the temporary test directory structure (runs once)
    before(async () => {
        console.log('\nSetting up test fixture...');
        // Create main nested structure
        await fs.mkdir(FILE_PATHS.SUB_DIR_B, { recursive: true });
        
        // Create edge case structure
        await fs.mkdir(FILE_PATHS.EMPTY_DIR);
        await fs.mkdir(FILE_PATHS.SHALLOW_DIR);
        
        // Write content to main files
        await fs.writeFile(FILE_PATHS.ROOT_FILE, CONTENT_ROOT);
        await fs.writeFile(FILE_PATHS.FILE_A, CONTENT_A);
        await fs.writeFile(FILE_PATHS.FILE_B, CONTENT_B);
        await fs.writeFile(FILE_PATHS.FILE_C, CONTENT_C);
        
        // Write content to shallow files (one empty, one with content)
        await fs.writeFile(FILE_PATHS.SHALLOW_FILE_1, CONTENT_EMPTY);
        await fs.writeFile(FILE_PATHS.SHALLOW_FILE_2, 'shallow content');

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
    // TEST GROUP 1: Basic Traversal and Callback Execution
    // ====================================================================
    describe('Test Group 1: Basic Traversal', () => {
        it('1.1 should recursively traverse the entire structure (6 files + 4 dirs) and call the callback 10 times', async () => {
            const callbackSpy = sinon.spy();
            
            await traversePath(TEMP_DIR, callbackSpy);

            // Total expected entries (6 files + 4 directories)
            expect(callbackSpy.callCount).to.equal(10);

            // Assertions to verify the count breakdown
            const fileCalls = callbackSpy.getCalls().filter(call => call.args[2] === false);
            const dirCalls = callbackSpy.getCalls().filter(call => call.args[2] === true);
            
            expect(fileCalls).to.have.lengthOf(TOTAL_FILES_COUNT, 'Should find exactly 6 files.');
            expect(dirCalls).to.have.lengthOf(TOTAL_DIR_COUNT, 'Should find exactly 4 directories.');
        });

        it('1.2 should correctly traverse an empty directory and call the callback 0 times', async () => {
            const callbackSpy = sinon.spy();
            
            await traversePath(FILE_PATHS.EMPTY_DIR, callbackSpy);

            // readdir on an empty directory returns an empty array, leading to 0 callback calls.
            expect(callbackSpy.callCount).to.equal(0);
        });

        it('1.3 should correctly traverse a shallow directory (no sub-folders)', async () => {
            const callbackSpy = sinon.spy();
            
            await traversePath(FILE_PATHS.SHALLOW_DIR, callbackSpy);

            // Expect 2 files
            expect(callbackSpy.callCount).to.equal(2);
            
            // Verify names
            const names = [callbackSpy.getCall(0).args[1], callbackSpy.getCall(1).args[1]];
            expect(names).to.include.members(['file1.txt', 'file2.txt']);
        });
        
        it('1.4 should ensure the traversal is depth-first (recursing before next sibling)', async () => {
            const callOrder = [];
            const orderCallback = async (path, name, isDir) => {
                callOrder.push(name);
            };

            await traversePath(TEMP_DIR, orderCallback);

            // Check that deeply nested files appear after their containing directory is processed.
            const srcIndex = callOrder.indexOf('src');
            const componentsIndex = callOrder.indexOf('components');
            
            expect(srcIndex).to.be.lessThan(callOrder.indexOf('app.js'), 'app.js should be after src'); 
            expect(componentsIndex).to.be.greaterThan(srcIndex, 'components should be after src'); 
            expect(callOrder.indexOf('button.jsx')).to.be.greaterThan(componentsIndex, 'button.jsx should be after components');
        });

        it('1.5 should verify correct parameters for a deeply nested file', async () => {
            const callbackSpy = sinon.spy();
            
            await traversePath(TEMP_DIR, callbackSpy);

            const fileCall = callbackSpy.getCalls().find(call => call.args[1] === 'button.jsx');
            
            expect(fileCall).to.exist;
            expect(fileCall.args[0]).to.equal(FILE_PATHS.FILE_B); // Full Path check
            expect(fileCall.args[1]).to.equal('button.jsx'); // Name check
            expect(fileCall.args[2]).to.be.false; // isDirectory check
        });
    });

    // ====================================================================
    // TEST GROUP 2: Search/Filtering Capability
    // ====================================================================
    describe('Test Group 2: Search and Filtering', () => {
        it('2.1 should filter for a specific file extension (.jsx) (search test)', async () => {
            const foundFiles = [];
            const searchCallback = async (path, name, isDir) => {
                if (!isDir && name.endsWith('.jsx')) {
                    foundFiles.push(name);
                }
            };

            await traversePath(TEMP_DIR, searchCallback);

            expect(foundFiles).to.have.lengthOf(1);
            expect(foundFiles[0]).to.equal('button.jsx');
        });

        it('2.4 should successfully skip traversal into the "components" directory by returning false', async () => {
            const callbackSpy = sinon.spy();
            
            const skipCallback = async (path, name, isDir) => {
                callbackSpy(path, name, isDir); // Record the call
                
                // Explicitly return false to prevent recursion into this directory
                if (isDir && name === 'components') {
                    return false; 
                }
                // Explicitly return true for all other entries to ensure continuation
                return true; 
            };

            await traversePath(TEMP_DIR, skipCallback);

            // Total expected calls: 10 - 2 skipped files = 8.
            expect(callbackSpy.callCount).to.equal(8); 
            
            // Check that the skipped files were not called
            const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
            expect(calledNames).to.not.include.members(['button.jsx', 'readme.md']);
        });

        it('2.5 should gracefully search an empty sub-directory', async () => {
            const foundFiles = [];
            const searchCallback = async (path, name, isDir) => {
                if (!isDir && name.endsWith('.js')) {
                    foundFiles.push(name);
                }
            };

            await traversePath(FILE_PATHS.EMPTY_DIR, searchCallback);

            expect(foundFiles).to.be.empty;
            // Ensure no error was logged during this successful traversal
            expect(consoleErrorStub.notCalled).to.be.true;
        });

        it('2.2 should filter to find a directory by name ("components")', async () => {
            const foundDirs = [];
            const searchCallback = async (path, name, isDir) => {
                if (isDir && name === 'components') {
                    foundDirs.push(name);
                }
            };

            await traversePath(TEMP_DIR, searchCallback);

            expect(foundDirs).to.have.lengthOf(1);
            expect(foundDirs[0]).to.equal('components');
        });

        it('2.3 should find multiple file types (.json or .md)', async () => {
            const foundFiles = [];
            const searchCallback = async (path, name, isDir) => {
                if (!isDir && (name.endsWith('.json') || name.endsWith('.md'))) {
                    foundFiles.push(name);
                }
            };

            await traversePath(TEMP_DIR, searchCallback);

            expect(foundFiles).to.have.lengthOf(2);
            expect(foundFiles).to.include.members(['root_config.json', 'readme.md']);
        });
    });

    // ====================================================================
    // TEST GROUP 3: Directory Command (Calculating Size/Command)
    // ====================================================================
    describe('Test Group 3: Directory Command (getDirectorySize)', () => {
        it('3.1 should correctly run the command (getDirectorySize) and calculate total size of main structure', async () => {
            const size = await getDirectorySize(TEMP_DIR);
            
            // Expected size includes all 6 files.
            const expectedTotal = EXPECTED_TOTAL_SIZE + Buffer.byteLength('shallow content');
            expect(size).to.equal(expectedTotal);
        });

        it('3.2 should calculate size of a specific subdirectory ("src") only', async () => {
            // Contents of 'src': app.js, components, button.jsx, readme.md
            const EXPECTED_SRC_SIZE = Buffer.byteLength(CONTENT_A) + 
                                      Buffer.byteLength(CONTENT_B) + 
                                      Buffer.byteLength(CONTENT_C);
                                      
            const size = await getDirectorySize(FILE_PATHS.SUB_DIR_A);

            expect(size).to.equal(EXPECTED_SRC_SIZE);
        });

        it('3.3 should correctly calculate size for files including a zero-byte file', async () => {
            // Contents of 'shallow': file1.txt (empty), file2.txt ('shallow content')
            const expectedSize = Buffer.byteLength('shallow content');

            const size = await getDirectorySize(FILE_PATHS.SHALLOW_DIR);

            expect(size).to.equal(expectedSize);
        });

        it('3.4 should return 0 size for a completely empty directory', async () => {
            const size = await getDirectorySize(FILE_PATHS.EMPTY_DIR);

            expect(size).to.equal(0);
        });

        it('3.5 should handle files that fail fs.stat (e.g., permissions issue) gracefully', async () => {
            const originalStat = fs.stat;
            // Stub fs.stat to throw an error for a specific file
            const statStub = sinon.stub(fs, 'stat').callsFake(async (path) => {
                if (path.includes('root_config.json')) {
                    const error = new Error("EACCES: permission denied");
                    error.code = 'EACCES';
                    throw error;
                }
                return originalStat(path);
            });

            // Calculate expected size by excluding the size of the root_config.json file
            const expectedSize = (EXPECTED_TOTAL_SIZE + Buffer.byteLength('shallow content')) - Buffer.byteLength(CONTENT_ROOT);

            try {
                const size = await getDirectorySize(TEMP_DIR);
                expect(size).to.equal(expectedSize);
                // The error should have been logged once inside the sizeCallback
                expect(consoleErrorStub.calledOnce).to.be.true; 
            } finally {
                statStub.restore();
            }
        });
    });

    // ====================================================================
    // TEST GROUP 4: Error Handling
    // ====================================================================
    describe('Test Group 4: Error Handling', () => {
        it('4.1 should log an error and return if the starting path is non-existent', async () => {
            const callbackSpy = sinon.spy();
            const badPath = join(TEMP_DIR, 'non-existent-start-dir');
            
            // Traverse the non-existent path
            await traversePath(badPath, callbackSpy);

            // Check that console.error stub was called exactly once
            expect(consoleErrorStub.calledOnce).to.be.true;
            // Check that the error message contains the expected text
            expect(consoleErrorStub.getCall(0).args[0]).to.include('Error accessing path');
            // Ensure callback was never called
            expect(callbackSpy.notCalled).to.be.true;
        });

        it('4.2 should log an error for an unreadable directory during deep traversal and continue', async () => {
            const originalReaddir = fs.readdir;
            let readdirStub;
            
            // Stub fs.readdir to throw an error for the 'components' folder
            readdirStub = sinon.stub(fs, 'readdir').callsFake(async (path, options) => {
                if (path.includes('components')) {
                    const error = new Error("EPERM: operation not permitted");
                    error.code = 'EPERM';
                    throw error;
                }
                return originalReaddir(path, options);
            });

            const callbackSpy = sinon.spy();
            try {
                await traversePath(TEMP_DIR, callbackSpy);

                // Total expected calls: 10 - 2 skipped files = 8.
                expect(callbackSpy.callCount).to.equal(8);
                // Check that the skipped files were not called
                const calledNames = callbackSpy.getCalls().map(call => call.args[1]);
                expect(calledNames).to.not.include.members(['button.jsx', 'readme.md']);
                expect(consoleErrorStub.calledOnce).to.be.true; // Error for unreadable 'components' dir
            } finally {
                readdirStub.restore();
            }
        });

        it('4.3 should handle an error thrown by the user-provided callback', async () => {
            const errorCallback = async (path, name, isDir) => {
                if (name === 'app.js') {
                    throw new Error("User callback failed for app.js");
                }
            };
            
            await traversePath(TEMP_DIR, errorCallback);

            // The utility catches the error from the callback and logs it.
            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.getCall(0).args[0]).to.include('Error in user callback for path');
            expect(consoleErrorStub.getCall(0).args[0]).to.include('User callback failed for app.js');
        });

        it('4.4 should ensure the recursion proceeds after one directory fails (Test 4.2 refinement)', async () => {
            const originalReaddir = fs.readdir;
            let readdirStub;
            const processedItems = [];
            
            // Stub fs.readdir to fail ONLY for the 'src' directory, but allow 'shallow'
            readdirStub = sinon.stub(fs, 'readdir').callsFake(async (path, options) => {
                if (path.includes('src')) {
                    const error = new Error("EPERM: src directory error");
                    error.code = 'EPERM';
                    throw error;
                }
                return originalReaddir(path, options);
            });

            const trackingCallback = async (path, name, isDir) => {
                processedItems.push(name);
            };

            try {
                await traversePath(TEMP_DIR, trackingCallback);

                // Expected calls: 6 (root_file, shallow_dir, empty_dir, src_dir, shallow_file_1, shallow_file_2)
                expect(processedItems).to.have.lengthOf(6);
                expect(processedItems).to.include.members(['file1.txt', 'file2.txt']); // Confirms shallow traversal completed
                expect(processedItems).to.include.members(['src']); // Confirms 'src' was called before failure
                expect(processedItems).to.not.include.members(['app.js', 'components']); // Confirms 'src' contents were skipped
                expect(consoleErrorStub.calledOnce).to.be.true; 
            } finally {
                readdirStub.restore();
            }
        });
    });
});