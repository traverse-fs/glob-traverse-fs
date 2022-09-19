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

const path = require('path');
const fs = require('fs');
const cliArgs = require("./cli.args").cliArgs;

async function getFiles(d, r = false, cb = (d, f) => { return path.join(d, f.name); }, pe = false, pef = (e) => { console.log(e) }, type = "nested") {
    var dir, result = [];
    try {
        dir = await fs.promises.opendir(d);
        var f;
        try {
            while (f = dir.readSync()) {
                try {
                    if (f.isFile()) {
                        result.push(cb(d, f));
                    } else {
                        if (!!r) {
                            if (type === "nested") {
                                let cf = await getFiles(path.join(d, f), r, cb, pe, pef, type);
                                result.push(cf);
                            } else if (type === "single") {
                                let cf = await getFiles(path.join(d, f), r, cb, pe, pef, type);
                                result.push(...cf);
                            }
                        } else {
                            result.push(cb(d, f));
                        }
                    }
                } catch (error) {
                    if (!!pe) {
                        pef(error);
                    }
                    continue;
                }
            }
            return result;
        } catch (err) {
            if (!!pe) {
                pef(err);
            }
        }
        dir.closeSync();
    } catch (e) {
        if (!!pe) {
            pef(e)
        }
    }
}

async function invoker(d, r, cb, pe, pef, type) {
    let result = await getFiles(d, r, cb, pe, pef, type).catch(pef);
    return result;
}

let nestedArray = function (d, r, cb, pe, pef, type) { return invoker(d, r, cb, pe, pef, type).then((r) => { console.log(r); return r; }); };
let stringList = function (d, r, cb, pe, pef, type) { return invoker(d, r, cb, pe, pef, type).then((r) => { console.log(r); return r; }); };

let searchCallback = function (f, searchPattern) {

}

let searchFiles = function () {

}

let searchFolders = function () {

}

let searchFilesFolders = function () {

}

// stringList("./", true, (d, f) => { return d + "__" + f.name; }, false, (e) => { console.log(e) }, "single");

module.exports = {
    folder: getFiles,
    returns: {
        nestedArray: nestedArray,
        stringList: stringList
    },
    search: {
        searchCallback: searchCallback,
        files: searchFiles,
        folders: searchFolders,
        filesFolders: searchFilesFolders
    },
    cliargs: cliArgs
}
