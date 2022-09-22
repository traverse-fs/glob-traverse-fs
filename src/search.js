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
const tfs = require("./traverse");


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
    // searchPattern = getRegExPattern(searchPattern, flag);
    // if (!f.isDir()) return false;
    // var variable  = 'index.js'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var variable = 'index.js';
    var r = new RegExp(`ReGeX${variable}ReGeX`);
    return (r.test(path.join(d, f.name).toString())) ? path.join(d, f.name) : false;
}


// function tfs.dir(d, r, cb, pe, pef, type) { return getFiles(d, r, cb, pe, pef, type).then(result => result).catch(pef); };

function searchFiles(d, r, cb = searchFilesCallback, pe, pef, type = "flatarray", options = { search: "files", text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };
function searchFolders(d, r, cb = searchFoldersCallback, pe, pef, type = "flatarray", options = { search: "folders", text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };
function searchFilesFolders(d, r, cb = searchCallback, pe, pef, type = "flatarray", options = { search: "all", text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };

function regexFiles(d, r, cb = searchFilesCallback, pe, pef, type = "flatarray", options = { regex: "files", pattern: null, text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };
function regexFolders(d, r, cb = searchFoldersCallback, pe, pef, type = "flatarray", options = { regex: "folders", pattern: null, text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };
function regexFilesFolders(d, r, cb = searchCallback, pe, pef, type = "flatarray", options = { regex: "all", pattern: null, text: [] }) { return tfs.dir(d, r, cb, pe, pef, type).then(res => res); };


// tfs.dir("./", true, searchFoldersCallback, false, tfs.callbacks.errorHandler, "flatarray").then(console.log)

function search(d, r, cb, pe, pef, type, options = { search: "all" }) {
    // search: "all" | "files" | "folder"
    // regex: "all" | "files" | "folder"
}

module.exports = {
    search: (d, r, cb = tfs.callbacks.searchFiles, pe, pef, type = "flatarray", options = { search: "all", text: [] }) => { return search(d, r, cb, pe, pef, type, options) },
    regex: (d, r, cb = tfs.callbacks.searchFiles, pe, pef, type = "flatarray", options = { regex: "all", pattern: null, text: [] }) => { return search(d, r, cb, pe, pef, type, options) },
    callbacks: {
        search: searchCallback,
        searchFiles: searchFilesCallback,
        searchFolder: searchFoldersCallback
    }
}
