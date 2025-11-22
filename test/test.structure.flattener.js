// /**
//  * path-flattener.test.js
//  *
//  * Mocha, Chai test suite for the flattenStructureToPaths utility.
//  *
//  * To run these tests, you must have Mocha and Chai installed:
//  * npm install --save-dev mocha chai
//  * Then run: npx mocha path-flattener.test.js
//  */
// const { expect } = require('chai');
// const { flattenStructureToPaths } = require('../index.js'); // Assuming the file is named file-traverser.js
// const { resolve } = require('path');

// describe('flattenStructureToPaths', () => {

//     it('should correctly flatten a deeply nested structure into an array of full paths', () => {
//         const nestedStructure = {
//             "root_folder": {
//                 "src": {
//                     "components": {
//                         "Button.js": "",
//                         "Icon.js": "",
//                     },
//                     "styles.css": ""
//                 },
//                 "assets": {
//                     "images": {} // Empty directory
//                 },
//                 "package.json": ""
//             }
//         };

//         const expectedPaths = [
//             'root_folder/src/components/Button.js',
//             'root_folder/src/components/Icon.js',
//             'root_folder/src/styles.css',
//             'root_folder/package.json'
//         ];

//         const paths = flattenStructureToPaths(nestedStructure);
        
//         expect(paths).to.be.an('array');
//         expect(paths).to.have.lengthOf(4);
//         // expect(paths).to.have.members(expectedPaths);
//     });

//     it('should correctly handle the user-provided example structure', () => {
//         const userExampleStructure = {
//             "dir": {
//                 "dir2": {}, 
//                 "file1": "", 
//                 "file2": ""
//             }
//         };
        
//         const expectedPaths = [
//             'dir/file1',
//             'dir/file2'
//         ];

//         const paths = flattenStructureToPaths(userExampleStructure);
        
//         expect(paths).to.be.an('array');
//         expect(paths).to.have.lengthOf(2);
//         expect(paths).to.have.members(expectedPaths);
//     });

//     it('should return an empty array for an empty structure', () => {
//         const paths = flattenStructureToPaths({});
//         expect(paths).to.be.an('array').that.is.empty;
//     });

//     it('should return an empty array if the entire structure is just empty directories', () => {
//         const nestedEmpty = {
//             "a": {
//                 "b": {},
//                 "c": {
//                     "d": {}
//                 }
//             }
//         };
//         const paths = flattenStructureToPaths(nestedEmpty);
//         expect(paths).to.be.an('array').that.is.empty;
//     });

//     it('should handle a structure with files at the root level (if no parent name is provided)', () => {
//         const rootFiles = {
//             "fileA.txt": "",
//             "folderB": {
//                 "fileC.txt": ""
//             }
//         };

//         const expectedPaths = [
//             'fileA.txt',
//             'folderB/fileC.txt'
//         ];

//         // The path will start from the keys provided
//         const paths = flattenStructureToPaths(rootFiles);
        
//         expect(paths).to.have.lengthOf(2);
//         expect(paths).to.have.members(expectedPaths);
//     });

//     it('should handle non-object/non-string values gracefully (ignore them)', () => {
//         const complexStructure = {
//             "file1": "",
//             "dir1": {
//                 "file2": "",
//                 "invalid": 123, // Ignored
//                 "list": ["a", "b"], // Ignored
//             },
//             "file3": "",
//         };

//         const expectedPaths = [
//             'file1',
//             'dir1/file2',
//             'file3',
//         ];

//         const paths = flattenStructureToPaths(complexStructure);
        
//         expect(paths).to.have.lengthOf(3);
//         expect(paths).to.have.members(expectedPaths);
//     });

// });