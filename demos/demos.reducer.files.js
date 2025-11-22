const fs = require('fs').promises;
const path = require('path');
const { resolve, dirname, join } = path;
const { getNestedStructure, buildStructure, flattenStructureToPaths,
    processPathsWithReducer, traversePath,
    getDirectorySize,
    traverseFS } = require("../index.js")


// ----------------------------------------------------------------------
// Example Usage
// ----------------------------------------------------------------------

// Example: Simulating a slow file processing operation (e.g., calculating checksums)
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

// Run the demonstration
async function runDemo() {
    const filePaths = [
        'src/index.js',
        'src/utils/data.json',
        'tests/suite.spec.js',
        'README.md'
    ];

    const initialAccumulator = {
        count: 0,
        log: [],
        startedAt: Date.now()
    };

    console.log('--- Starting Sequential Path Processing Demo ---');

    const finalResult = await processPathsWithReducer(
        filePaths,
        pathReducer,
        initialAccumulator
    );

    const duration = Date.now() - finalResult.startedAt;

    console.log('\n--- Processing Complete ---');
    console.log(`Total duration (approx, due to 50ms delay per file): ${duration}ms`);
    console.log('Final Result:', finalResult);
}

// runDemo(); // Uncomment to run the demonstration in a Node.js environment