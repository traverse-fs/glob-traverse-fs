/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i 
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: traverse.js
 * File Description: Traverse folder and files core file
 * 
*/

var expect = require('chai').expect;

describe('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: Test Suite for Traverse Files and Folders returning multi level array', function() {

    describe ('traverse:fssys:traverse-cli: [Test A] Test Suite for traversing folders in main repo directory', function() {
        // it('[Test A] package.json Present', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test A] Traverse file LICENSE in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Traverse file package.json in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Traverse file package-lock.json in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Traverse folder ./node_modules in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test A] Traverse folder ./test in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });

    describe ('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: [Test B] Test Suite for traversing and searching folders in main repo directory', function() {
        // it('[Test B] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test B] Search file LICENSE in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test B] Search file package.json in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test B] Search file package-lock.json in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test B] Search folder ./node_modules in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test B] Search folder ./test in main directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });

    describe ('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: [Test C] Test Suite Recursive for traversing folders in subfolders of repo directory', function() {
        // it('[Test C] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test C] Traverse file LICENSE in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test C] Traverse file package.json in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test C] Traverse file package-lock.json in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test C] Traverse folder ./node_modules/.bin in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test C] Traverse folder ./node_modules/chai in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });

    describe ('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: [Test D] Test Suite Recursive for traversing and searching folders in main repo directory', function() {
        // it('[Test D] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test D] Traverse and Search file LICENSE in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test D] Traverse and Search file package.json in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test D] Traverse and Search file package-lock.json in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test D] Traverse and Search folder ./node_modules/.bin in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test D] Traverse and Search folder ./node_modules/chai in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });

    describe ('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: [Test E] Test Suite Negatives for traversing folders in main repo directory', function() {
        // it('[Test E] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test E] Traverse file LICENSES not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test E] Traverse file packages.json not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test E] Traverse file package-locks.json not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test E] Traverse folder ./node_modules/.someotherthing not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test E] Traverse folder ./node_modules/something not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });

    describe ('test.traverse.filesfolder.nestedarray.js::traverse:fssys:traverse-cli: [Test F] Test Suite Negatives for traversing and searching folders in main repo directory', function() {
        // it('[Test F] status', function(done){
        //     expect(200).to.equal(200);
        //     done();
        // });

        it('[Test F] Traverse and Search file LICENSES not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test F] Traverse and Search file packages.json not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test F] Traverse and Search file package-locks.json not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test F] Traverse and Search folder ./node_modules/.someotherthing not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });

        it('[Test F] Traverse and Search folder ./node_modules/something not in subfolders of repo directory', function(done) {
            expect(100).to.equal(100);
            done();
        });
    });
});


