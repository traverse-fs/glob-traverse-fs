/**
 * file-traverser.js (Updated)
 *
 * Includes the utility: flattenStructureToPaths
 */
const path = require('path');
// Use path.join for consistency in path building
const { join } = path;
const { flattenStructureToPaths } = require("../index.js")
// ----------------------------------------------------------------------
// Demonstration Section (Example Usage)
// ----------------------------------------------------------------------

// Define the complex nested structure
const projectStructure = {
    "my_project": {
        "src": {
            "main.js": "",
            "utils": {
                "helper.js": "",
                "data": {} // An empty directory
            },
            "README.md": ""
        },
        "tests": {
            "unit": {
                "test_A.js": ""
            }
        },
        "config.json": ""
    }
};

console.log('--- File Structure Input ---');
// Pretty print the input structure for clarity
console.log(JSON.stringify(projectStructure, null, 2));

// Process the structure
const filePaths = flattenStructureToPaths(projectStructure);

console.log('\n--- Extracted File Paths (Project Structure) ---');
filePaths.forEach(p => console.log(p));

// Verify the result against the example given by the user
const userExampleStructure = {
    "dir": {
        "dir2": {},
        "file1": "",
        "file2": ""
    }
};
console.log('\n--- Extracted File Paths (User Example) ---');
const userPaths = flattenStructureToPaths(userExampleStructure);
userPaths.forEach(p => console.log(p));

// Export the function for testing or use in other modules