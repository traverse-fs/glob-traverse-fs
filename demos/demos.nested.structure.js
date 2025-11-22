/**
 * demo.js
 * * Demonstrates the use of the getNestedStructure function.
 * Creates a temporary file structure, runs the function, and prints the result.
 */
const fs = require('fs').promises;
const path = require('path');
const { resolve, join } = path;
const { getNestedStructure } = require('../index.js'); // Assuming file-traverser.js is in the same directory

// --- Configuration ---
const TEMP_DIR = resolve('./temp_demo_root');
const SUB_DIR_A_PATH = join(TEMP_DIR, 'src');
const SUB_DIR_B_PATH = join(SUB_DIR_A_PATH, 'components');
const SUB_DIR_C_PATH = join(TEMP_DIR, 'CaseSensitive');
const EMPTY_DIR_PATH = join(TEMP_DIR, 'empty_dir');
const SHALLOW_DIR_PATH = join(TEMP_DIR, 'shallow');

const FILE_PATHS = {
    ROOT_FILE: join(TEMP_DIR, 'root_config.json'),
    FILE_A: join(SUB_DIR_A_PATH, 'app.js'),
    FILE_B: join(SUB_DIR_B_PATH, 'button.jsx'),
    FILE_C: join(SUB_DIR_B_PATH, 'readme.md'),
    FILE_D: join(SUB_DIR_C_PATH, 'TEST.txt'),
    SHALLOW_FILE_1: join(SHALLOW_DIR_PATH, 'file1.txt'),
    SHALLOW_FILE_2: join(SHALLOW_DIR_PATH, 'file2.txt'),
};

/**
 * 1. Setup: Creates the necessary directories and files.
 */
async function setupFixture() {
    console.log(`Setting up temporary directory: ${TEMP_DIR}`);
    
    // 1. Create nested structure
    await fs.mkdir(SUB_DIR_B_PATH, { recursive: true });
    
    // 2. Create sibling directories
    await fs.mkdir(EMPTY_DIR_PATH);
    await fs.mkdir(SHALLOW_DIR_PATH);
    await fs.mkdir(SUB_DIR_C_PATH); 
    
    // 3. Write files
    await fs.writeFile(FILE_PATHS.ROOT_FILE, '{"version": 1}');
    await fs.writeFile(FILE_PATHS.FILE_A, '...');
    await fs.writeFile(FILE_PATHS.FILE_B, '...');
    await fs.writeFile(FILE_PATHS.FILE_C, '...');
    await fs.writeFile(FILE_PATHS.FILE_D, '...');
    await fs.writeFile(FILE_PATHS.SHALLOW_FILE_1, '');
    await fs.writeFile(FILE_PATHS.SHALLOW_FILE_2, 'content');
    
    console.log('Setup complete.');
}

/**
 * 2. Cleanup: Removes the temporary directory.
 */
async function cleanupFixture() {
    console.log(`\nCleaning up temporary directory: ${TEMP_DIR}`);
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
    console.log('Cleanup complete. Demo finished.');
}

/**
 * 3. Main execution function.
 */
async function runDemo() {
    try {
        await setupFixture();

        console.log('\n--- Running getNestedStructure ---\n');
        
        // running nestsed structure - make this to demo.
        const nestedStructure = await getNestedStructure(TEMP_DIR);

        console.log(`Structure of '${path.basename(TEMP_DIR)}' children (total ${nestedStructure.length} entries):\n`);
        
        // Print the JSON result, formatted for readability
        console.log(JSON.stringify(nestedStructure, (key, value) => {
            // Shorten the 'fullPath' for cleaner console output
            if (key === 'fullPath') {
                return value.replace(TEMP_DIR, '<ROOT>');
            }
            return value;
        }, 2));
        
        console.log('\n----------------------------------');

    } catch (error) {
        console.error('\nDemo failed:', error.message);
    } finally {
        await cleanupFixture();
    }
}

runDemo();