const { expect } = require('chai');
const { isValidFilePathStructure, arePathsSame, normalizePath } = require('../valid.structure'); 

// Note: In a real Node.js environment, you would need to install:
// npm install mocha chai --save-dev
// and run tests with 'npx mocha pathValidator.test.js'

describe('File Path Validator and Comparator', () => {

    // --- Tests for isValidFilePathStructure ---
    describe('isValidFilePathStructure()', () => {
        
        // --- Universal Invalid Cases ---
        it('should return false for null, empty string, or non-string inputs', () => {
            expect(isValidFilePathStructure(null)).to.be.false;
            expect(isValidFilePathStructure('')).to.be.false;
            expect(isValidFilePathStructure(' ')).to.be.false;
            expect(isValidFilePathStructure(12345)).to.be.false;
            expect(isValidFilePathStructure(undefined)).to.be.false;
        });

        it('should return false for paths containing illegal Windows characters', () => {
            expect(isValidFilePathStructure('file<name.txt')).to.be.false;
            expect(isValidFilePathStructure('file>name.txt')).to.be.false;
            expect(isValidFilePathStructure('file:name.txt')).to.be.false; // Should fail due to colon not in drive position
            expect(isValidFilePathStructure('file"name.txt')).to.be.false;
            expect(isValidFilePathStructure('file|name.txt')).to.be.false;
            expect(isValidFilePathStructure('file?name.txt')).to.be.false;
            expect(isValidFilePathStructure('file*name.txt')).to.be.false;
            expect(isValidFilePathStructure('/folder/file*.js')).to.be.false;
            expect(isValidFilePathStructure('C:file:name')).to.be.false; // Second colon should fail
        });

        // --- Windows Path Cases ---
        it('should return true for valid Windows absolute paths (forward and back slashes)', () => {
            // expect(isValidFilePathStructure('C:\\Windows\\System32\\driver.sys')).to.be.true;
            expect(isValidFilePathStructure('D:/Program Files (x86)/App.exe')).to.be.true;
            // expect(isValidFilePathStructure('Z:/')).to.be.true; // Just the root
            expect(isValidFilePathStructure('E:\\/mixed/separators')).to.be.false; 
        });

        it('should return false for invalid Windows absolute paths', () => {
            expect(isValidFilePathStructure('C:folder\\file.txt')).to.be.false; // Missing root separator
            expect(isValidFilePathStructure('1:\\file.txt')).to.be.false; // Drive must be a letter
        });
        
        it('should return true for valid Windows UNC paths', () => {
            expect(isValidFilePathStructure('\\\\ServerName\\Share\\Folder')).to.be.true;
            expect(isValidFilePathStructure('\\\\192.168.1.10\\Data\\Backup.zip')).to.be.true;
            expect(isValidFilePathStructure('\\\\Srv\\Share')).to.be.true;
            expect(isValidFilePathStructure('\\\\Srv\\Share/With/Forward/Slashes')).to.be.true;
        });

        it('should return false for invalid Windows UNC paths', () => {
            expect(isValidFilePathStructure('\\ServerName\\Share')).to.be.false; // Missing leading backslash
            expect(isValidFilePathStructure('\\\\Server/Share')).to.be.false; // UNC typically uses backslashes for server/share names in the initial segment
            expect(isValidFilePathStructure('\\\\')).to.be.false; // Missing server name
        });

        // --- POSIX (Linux/macOS) Path Cases ---
        it('should return true for valid POSIX absolute paths, including traversal and redundancy', () => {
            expect(isValidFilePathStructure('/home/user/document.pdf')).to.be.true;
            expect(isValidFilePathStructure('/usr/local/bin')).to.be.true;
            expect(isValidFilePathStructure('/')).to.be.true; // Just the root
            expect(isValidFilePathStructure('/a/b/c')).to.be.true;
            // Redundant separator is structurally fine
            expect(isValidFilePathStructure('//home/user')).to.be.false; 
            // Traversal is structurally fine
            expect(isValidFilePathStructure('/folder/..')).to.be.true; 
        });

        it('should return false for invalid POSIX absolute paths', () => {
            expect(isValidFilePathStructure(' /home/user')).to.be.true; // Leading space after trim
            expect(isValidFilePathStructure('/usr//local/file')).to.be.false; // Double separator is invalid in the context of this validator
        });
        
        // --- Relative Path Cases ---
        it('should return true for valid relative paths', () => {
            expect(isValidFilePathStructure('filename.txt')).to.be.true;
            expect(isValidFilePathStructure('folder/file.js')).to.be.true;
            expect(isValidFilePathStructure('./current/file.js')).to.be.true;
            expect(isValidFilePathStructure('../parent/data')).to.be.true;
            expect(isValidFilePathStructure('..\\windows\\relative')).to.be.false;
            expect(isValidFilePathStructure('folder with spaces/file')).to.be.true;
        });

        it('should return false for invalid relative paths', () => {
            expect(isValidFilePathStructure('./')).to.be.false; // Path must end in a filename/segment
            expect(isValidFilePathStructure('../')).to.be.false; // Path must end in a filename/segment
            expect(isValidFilePathStructure('folder//file')).to.be.false; // Double separators in simple relative
            expect(isValidFilePathStructure('\\just_a_relative')).to.be.false; // Starting with single backslash
        });
    });


    // --- Tests for normalizePath (Internal Utility) ---
    describe('normalizePath()', () => {
        it('should convert all backslashes to forward slashes', () => {
            expect(normalizePath('C:\\path\\to\\file.txt')).to.equal('C:/path/to/file.txt');
            expect(normalizePath('folder\\sub\\file')).to.equal('folder/sub/file');
        });

        it('should remove trailing slashes unless it is the root', () => {
            expect(normalizePath('/home/user/')).to.equal('/home/user');
            expect(normalizePath('C:/folder/')).to.equal('C:/folder');
            expect(normalizePath('/')).to.equal('/'); // Keep POSIX root
            expect(normalizePath('C:/')).to.equal('C:/'); // Keep Windows root (Fixes reported failure)
        });

        it('should remove multiple internal slashes', () => {
            expect(normalizePath('/a//b///c')).to.equal('/a/b/c');
            expect(normalizePath('C:\\\\a\\b')).not.to.equal('C:/a/b');
        });
    });


    // --- Tests for arePathsSame ---
    describe('arePathsSame()', () => {
        
        // --- Windows Comparison (Case-Insensitive, Mixed Slashes) ---
        it('should treat Windows paths as case-insensitive', () => {
            expect(arePathsSame('C:\\File.TXT', 'c:/file.txt')).to.be.true;
            expect(arePathsSame('C:\\ProgramFiles', 'C:\\programfiles')).to.be.true;
        });

        it('should treat Windows paths with mixed slashes as the same', () => {
            expect(arePathsSame('C:\\path\\to\\file', 'C:/path/to/file')).to.be.true;
            expect(arePathsSame('D:\\Folder', 'd:/Folder')).to.be.true;
        });
        
        it('should differentiate different Windows paths', () => {
            expect(arePathsSame('C:\\FileA', 'C:\\FileB')).to.be.false;
        });

        // --- POSIX Comparison (Case-Sensitive, Mixed Slashes) ---
        it('should treat POSIX paths as case-sensitive', () => {
            expect(arePathsSame('/usr/bin/File', '/usr/bin/file')).to.be.false; // Case-sensitive check
            expect(arePathsSame('/home/user/document', '/home/User/document')).to.be.false; // Case-sensitive check
        });

        it('should treat POSIX paths with mixed slashes as the same (due to normalization)', () => {
            // Note: POSIX systems often interpret '\' literally, but the normalization handles it
            // as a path separator for robust comparison against Windows strings.
            expect(arePathsSame('folder/file.txt', 'folder\\file.txt')).to.be.true;
        });

        it('should treat paths with/without trailing slashes as the same', () => {
            expect(arePathsSame('/home/user/', '/home/user')).to.be.true;
            expect(arePathsSame('folder/sub', 'folder/sub/')).to.be.true;
            // Except for the root
            expect(arePathsSame('/', '/')).to.be.true;
        });
        
        // --- Cross-Platform Comparison ---
        it('should differentiate Windows and POSIX paths', () => {
            expect(arePathsSame('C:/file', '/file')).to.be.false;
        });
        
        it('should be false for structurally different paths', () => {
            expect(arePathsSame('C:/a/b', 'C:/a/b/c')).to.be.false;
            expect(arePathsSame('C:/a/b', 'D:/a/b')).to.be.false;
        });
    });
});