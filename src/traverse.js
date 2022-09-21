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


const defaultFetch = (d, f) => path.join(d, f.name);
const defaultJSONFetch = (d, f) => {
    if ((os.type() === "Windows_NT") && f.name.includes("\\")) {
        return path.join(f.name.split("\\").at(-1));
    }
    return path.join(f.name.split("/").at(-1))
};
const defaultErrorHandler = (e) => console.log(e);

const getRegExPattern = function (searchPattern, flag) {
    if (typeof searchPattern === "string") {
        return new RegExp(`${searchPattern}`, g);
    }
    return searchPattern;
}

const searchCallback = function (d, f, searchPattern, flag = undefined) {
    searchPattern = getRegExPattern(searchPattern, flag);
    return (searchPattern.match()) ? path.join(d, f.name) : false;
}

const searchFilesCallback = function (d, f, searchPattern, flag = undefined) {
    searchPattern = getRegExPattern(searchPattern, flag);
    if (!f.isFile()) return false;
    return (searchPattern.match()) ? path.join(d, f.name) : false;
}

const searchFoldersCallback = function (d, f, searchPattern, flag = undefined) {
    searchPattern = getRegExPattern(searchPattern, flag);
    if (!f.isDir()) return false;
    return (searchPattern.match()) ? path.join(d, f.name) : false;
}

async function getFiles(d, r = false, cb = defaultFetch, pe = false, pef = defaultErrorHandler, type = "nested") {
    var dir, result = [];
    try {
        dir = await fs.promises.opendir(d);
        var f;
        try {
            while (f = dir.readSync()) {
                try {
                    if (f.isFile()) {
                        result.push(cb(d, f, null, null));
                    } else {
                        if (!!r) {
                            if (type === "flatarray") {
                                let cf = await getFiles(defaultFetch(d, f), r, cb, pe, pef, type);
                                result.push(...cf);
                            } else if (type === "json") {
                                let cf = await getFiles(defaultFetch(d, f), r, cb, pe, pef, type);
                                result.push({ [f.name]: cf });
                            } else {
                                let cf = await getFiles(defaultFetch(d, f), r, cb, pe, pef, type);
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

function invoker(d, r, cb, pe, pef, type) { return getFiles(d, r, cb, pe, pef, type).then(result => result).catch(pef); };
function searchFiles(d, r, cb = searchFilesCallback, pe, pef, type = "single") { return invoker(d, r, cb, pe, pef, type).then(res => res); };
function searchFolders(d, r, cb = searchFoldersCallback, pe, pef, type = "single") { return invoker(d, r, cb, pe, pef, type).then(res => res); };
function searchFilesFolders(d, r, cb = searchCallback, pe, pef, type = "single") { return invoker(d, r, cb, pe, pef, type).then(res => res); };
function nestedArray(d, r, cb = defaultFetch, pe, pef, type = "nestedarray") { return invoker(d, r, cb, pe, pef, type).then(res => res) };
function flatArray(d, r, cb = defaultFetch, pe, pef, type = "flatarray") { return invoker(d, r, cb, pe, pef, type).then(res => res) };
function json(d, r, cb = defaultJSONFetch, pe, pef, type = "json") { return invoker(d, r, cb, pe, pef, type).then(res => res) };

// invoker("./", true, defaultFetch, false, defaultErrorHandler, "nestedarray").then(console.log)
// invoker("./", true, defaultJSONFetch, false, defaultErrorHandler, "json").then(console.log)

module.exports = {
    dir: invoker,
    returns: {
        nestedArray: nestedArray,
        flatArray: flatArray,
        json: json
    },
    callbacks: {
        defaultFetch: defaultFetch,
        jsonFetch: defaultJSONFetch,
        // search: searchCallback,
        // searchFiles: searchFilesCallback,
        // searchFolders: searchFoldersCallback
    },
    // search: {
    //     all: searchFilesFolders,
    //     files: searchFiles,
    //     folders: searchFolders
    // },
    cliargs: cliArgs
}
