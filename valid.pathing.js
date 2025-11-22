/**
 * Cross-Platform File Path Structure Validator and Comparator
 *
 * This module exports functions for checking if a string adheres to the structural
 * conventions of a valid file path and for checking if two path strings refer to
 * the same logical path, handling cross-platform differences like separators and case.
 */
/**
 * Checks if a given string has a valid file path structure based on
 * Windows, Linux (POSIX), or macOS (POSIX) conventions.
 *
 * @param {string} path The file path string to validate.
 * @returns {boolean} True if the structure is valid, false otherwise.
 */
function isValidFilePathStructure(path) {
    if (!path || typeof path !== 'string' || path.trim() === '') {
        return false;
    }

    const trimmedPath = path.trim();

    // Reusable set of allowed characters for segments (everything except illegal chars and separators)
    // The negative class excludes: \r \n < > " | ? * / \ :
    const segmentChars = '[^\\r\\n<>:"|?*\\/\\\\]';
    
    // Pattern for a sequence of segments separated by single slashes.
    // Example: (segment/)*segment
    const strictSegmentSequence = `(${segmentChars}+([\\/]?${segmentChars}+)*)*`;


    // 1. Check for universally illegal characters (Windows reserved characters)
    // Reject: < > " | ? *
    const universalIllegalChars = /[<>\"|?*]/;
    if (universalIllegalChars.test(trimmedPath)) {
        return false;
    }

    // 1b. Handle Colon ':' character separately. It is ONLY valid in the drive-letter position.
    if (trimmedPath.includes(':')) {
        // If it doesn't match the start of a Windows drive path (X:), any colon is illegal.
        if (!/^[A-Za-z]:/.test(trimmedPath)) {
            return false;
        }
        // If it starts with X:, ensure there are NO other colons in the rest of the path.
        if (trimmedPath.slice(2).includes(':')) {
            return false;
        }
    }


    // --- Windows Path Validation ---

    // 2. Absolute Path (Drive letter and root separator)
    // Matches: C:\folder\file, D:/folder/file, C:/
    const windowsAbsoluteRegex = new RegExp(`^[A-Za-z]:[\\/](?:${strictSegmentSequence})?$`);
    const isWindowsAbsolute = windowsAbsoluteRegex.test(trimmedPath);


    // 3. UNC/Network Path
    // UNC paths are allowed to have multiple slashes at the start (\\\\server\share),
    // so we use a specialized, separate regex for this.
    const isUNCPath = /^\\\\[^\\/]+\\[^\\/]+([\\/][^\r\n<>:"|?*]+)*$/.test(trimmedPath);

    // --- POSIX Path Validation (Linux/macOS) ---

    // 4. Absolute Path (Starts with a single forward slash)
    // Path must start with /, followed by segment structure, OR just '/'
    // The sequence must not start or end with a separator, so only /segment/segment is allowed, not //segment or /segment/
    const posixAbsoluteRegex = new RegExp(`^\\/(${segmentChars}+([\\/]?${segmentChars}+)*)*$|^\\/$`);
    const isPosixAbsolute = posixAbsoluteRegex.test(trimmedPath);


    // --- Relative Path Validation ---

    // If it's not a recognized absolute path, check if it's a valid relative path structure.
    if (!isWindowsAbsolute && !isUNCPath && !isPosixAbsolute) {
        // This is the core relative segment structure. It allows:
        // - segment, ./segment, ../segment
        // - segment/segment (and combination of dots)
        // Note: It must NOT end with a separator.
        const relativeSegmentRegex = new RegExp(`^(?:\\.{1,2}[\\/])?(${segmentChars}+([\\/]?${segmentChars}+)*)$`);
        
        const isSimpleRelative = relativeSegmentRegex.test(trimmedPath);
        return isSimpleRelative;
    }

    return isWindowsAbsolute || isUNCPath || isPosixAbsolute;
}

/**
 * Normalizes a file path to a common format (forward slashes, no trailing slash).
 * Note: Does not resolve '..' or '.' segments.
 *
 * @param {string} path The file path to normalize.
 * @returns {string} The normalized path.
 */
function normalizePath(path) {
    if (!path || typeof path !== 'string') return '';
    
    // 1. Replace all backslashes with forward slashes
    let normalized = path.replace(/\\/g, '/');

    // 2. Remove multiple consecutive slashes (except for leading double slashes in UNC/POSIX)
    // This regex prevents double slashes except when preceded by a colon (Windows drive letter)
    normalized = normalized.replace(/([^:]\/)\/+/g, '$1');
    
    // 3. Remove trailing slash, unless it's just '/' or a Windows drive root ('C:/')
    if (normalized.length > 1 && normalized.endsWith('/')) {
        // Check if it's exactly a Windows drive root, e.g., 'C:/'
        // Check for length 3, second character is ':', and first is a letter.
        const isWindowsRoot = normalized.length === 3 && normalized[1] === ':' && /[A-Za-z]/.test(normalized[0]);

        // Only remove the slash if it's NOT a Windows drive root path and not the POSIX root.
        if (!isWindowsRoot) {
            normalized = normalized.slice(0, -1);
        }
    }
    
    return normalized;
}

/**
 * Checks if two file paths are logically the same, considering platform differences
 * like separators and case sensitivity for Windows drive letters.
 *
 * @param {string} path1 First file path.
 * @param {string} path2 Second file path.
 * @returns {boolean} True if the paths are logically same, false otherwise.
 */
function arePathsSame(path1, path2) {
    if (path1 === path2) return true;

    const n1 = normalizePath(path1);
    const n2 = normalizePath(path2);

    // Check if both paths look like Windows absolute paths (e.g., start with X:/)
    const isWindowsPath1 = /^[A-Za-z]:\//.test(n1);
    const isWindowsPath2 = /^[A-Za-z]:\//.test(n2);

    if (isWindowsPath1 && isWindowsPath2) {
        // For Windows paths, compare case-insensitively
        return n1.toLowerCase() === n2.toLowerCase();
    }

    // Otherwise (POSIX/UNC), compare case-sensitively
    return n1 === n2;
}


module.exports = {
    isValidFilePathStructure,
    arePathsSame,
    // Export normalizePath for testing purposes, although it's internal logic
    normalizePath 
};

// /**
//  * Cross-Platform File Path Structure Validator
//  *
//  * This module exports a function that checks if a string adheres to the structural
//  * conventions of a valid file path on Windows, Linux (POSIX), or macOS (POSIX).
//  *
//  * NOTE: This check is purely structural and does not verify the actual existence
//  * or accessibility of the path on the filesystem.
//  */

// /**
//  * Checks if a given string has a valid file path structure.
//  *
//  * @param {string} path The file path string to validate.
//  * @returns {boolean} True if the structure is valid, false otherwise.
//  */
// function isValidFilePathStructure(path) {
//     if (!path || typeof path !== 'string' || path.trim() === '') {
//         return false;
//     }

//     const trimmedPath = path.trim();

//     // 1. Check for universally illegal characters (Windows reserved characters)
//     // Reject: < > : " | ? *
//     // NOTE: / and \ are allowed as they are path separators, handled in specific regexes.
//     const universalIllegalChars = /[<>:"|?*]/;
//     if (universalIllegalChars.test(trimmedPath)) {
//         return false;
//     }

//     // --- Windows Path Validation ---

//     // 2. Absolute Path (Drive letter and root separator)
//     // Matches: C:\folder\file, D:/folder/file
//     // The [^\r\n...] part ensures only valid filename characters follow.
//     const isWindowsAbsolute = /^[A-Za-z]:[\\/]([^\r\n<>:"|?*]*)$/.test(trimmedPath);

//     // 3. UNC/Network Path
//     // Matches: \\server\share\file (starts with two backslashes)
//     const isUNCPath = /^\\\\[^\\/]+\\[^\\/]+([\\/][^\r\n<>:"|?*]+)*$/.test(trimmedPath);

//     // --- POSIX Path Validation (Linux/macOS) ---

//     // 4. Absolute Path (Starts with a single forward slash)
//     // Matches: /usr/local/bin, /home/user/document.txt
//     const isPosixAbsolute = /^\/([^\r\n<>:"|?*]*)$/.test(trimmedPath);

//     // --- Relative Path Validation ---

//     // If it's not a recognized absolute path, check if it's a valid relative path structure.
//     // This allows: 'file.txt', './folder/file.js', '../data', 'folder\file'
//     // It verifies that the path starts with a name or relative indicator (., ..)
//     // and uses only valid characters and standard separators.
//     if (!isWindowsAbsolute && !isUNCPath && !isPosixAbsolute) {
//         const isSimpleRelative = /^(?:\.{1,2}[\\/])?(?:[^\r\n<>:"|?*\\/]+[\\/]?)*[^\r\n<>:"|?*\\/]+$/.test(trimmedPath);
//         return isSimpleRelative;
//     }

//     return isWindowsAbsolute || isUNCPath || isPosixAbsolute;
// }


// // --- Example Usage ---

// const paths = [
//     // Valid Examples
//     "C:\\Users\\Document.docx",      // Windows Absolute (Backslash)
//     "D:/Program Files/app.exe",      // Windows Absolute (Forward slash)
//     "/usr/local/bin/script.sh",      // POSIX Absolute (Linux/macOS)
//     "folder/subfolder/file.txt",     // POSIX Relative
//     ".\\relative\\file.js",          // Windows Relative
//     "../data/config.json",           // POSIX Relative (Parent directory)
//     "\\ServerName\\ShareName\\Data", // Windows UNC Path
//     "just_a_filename.pdf",           // Simple Relative

//     // Invalid Examples
//     "C:users/doc.txt",               // Missing root separator
//     "/usr//local/file",              // Double separators (often invalid)
//     "invalid|char.txt",              // Contains illegal pipe character
//     "file?name.txt",                 // Contains illegal question mark
//     ""                               // Empty string
// ];

// console.log("--- File Path Validation Test Results ---");
// paths.forEach(p => {
//     const isValid = isValidFilePathStructure(p);
//     console.log(`Path: "${p.padEnd(30)}" -> ${isValid ? 'VALID' : 'INVALID'}`);
// });

// // Export the function for use in other Node.js files
// module.exports = { isValidFilePathStructure };















// ===============================================TESTS
