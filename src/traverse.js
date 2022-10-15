/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-cli, npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: traverse.js
 * File Description: Traverse folder and files core file
 * 
*/

// import path from 'path';
// import fs from 'fs';
// import * as c from "./cli.args.js";

const path = require("path");
const fs = require("fs");
const os = require("os");
const cliArgs = require("./cli.args").cliArgs;


const defaultFetch = (directory, fileDirent) => path.join(directory, fileDirent.name);
const defaultJSONFetch = (directory, fileDirent) => {
    if ((os.type() === "Windows_NT") && fileDirent.name.includes("\\")) {
        return path.join(fileDirent.name.split("\\").at(-1));
    }
    return path.join(fileDirent.name.split("/").at(-1))
};
const defaultErrorHandler = (error) => console.log(error);

async function getFilesFolders(d, r = false, cb = defaultFetch, pe = false, pef = defaultErrorHandler, type = "nestedarray") {
    var dir, result = [];
    try {
        dir = await fs.promises.opendir(d);
        var f;
        try {
            while (f = dir.readSync()) {
                try {
                    if (f.isFile()) {
                        item = cb(d, f, null, null);
                        if (!!item) result.push(item);
                    } else {
                        if (!!r) {
                            if (type === "flatarray") {
                                let cf = await getFilesFolders(defaultFetch(d, f), r, cb, pe, pef, type);
                                result.push(...cf);
                            } else if (type === "json") {
                                let cf = await getFilesFolders(defaultFetch(d, f), r, cb, pe, pef, type);
                                result.push({ [f.name]: cf });
                            } else {
                                let cf = await getFilesFolders(defaultFetch(d, f), r, cb, pe, pef, type);
                                result.push(cf);
                            }
                        } else {
                            item = cb(d, f, null, null);
                            if (!!item) result.push(item);
                        }
                    }
                } catch (error) {
                    if (!!pe) pef(error);
                    continue;
                }
            }
            dir.closeSync();
            return result;
        } catch (err) {
            if (!!pe) pef(err);
        }
    } catch (e) {
        if (!!pe) pef(e);
    }
}

function invoke(directory, recursive, fetchModifierCallback, handleProcessExit, errorHandler, type) { return getFilesFolders(directory, recursive, fetchModifierCallback, handleProcessExit, errorHandler, type).then(result => result).catch(errorHandler); };
function nestedArray(directory, recursive, fetchModifierCallback = defaultFetch, handleProcessExit, errorHandler, type = "nestedarray") { return invoke(directory, recursive, fetchModifierCallback, handleProcessExit, errorHandler, type).then(res => res) };
function flatArray(directory, recursive, fetchModifierCallback = defaultFetch, handleProcessExit, errorHandler, type = "flatarray") { return invoke(directory, recursive, fetchModifierCallback, handleProcessExit, errorHandler, type).then(res => res) };
function json(directory, recursive, fetchModifierCallback = defaultJSONFetch, handleProcessExit, errorHandler, type = "json") { return invoke(directory, recursive, fetchModifierCallback, handleProcessExit, errorHandler, type).then(res => res) };

// invoke("./", true, defaultFetch, false, defaultErrorHandler, "nestedarray").then(console.log)
// invoke("./", true, defaultJSONFetch, false, defaultErrorHandler, "json").then(console.log)

module.exports = {
    dir: invoke,
    returnNestedArray: nestedArray,
    returnFlatArray: flatArray,
    returnJSON: json,
    callbacks: {
        defaultFetch: defaultFetch,
        jsonFetch: defaultJSONFetch,
        errorHandler: defaultErrorHandler
    },
    cliargs: cliArgs
}
