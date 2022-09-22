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

function invoke(d, r, cb, pe, pef, type) { return getFilesFolders(d, r, cb, pe, pef, type).then(result => result).catch(pef); };
function nestedArray(d, r, cb = defaultFetch, pe, pef, type = "nestedarray") { return invoke(d, r, cb, pe, pef, type).then(res => res) };
function flatArray(d, r, cb = defaultFetch, pe, pef, type = "flatarray") { return invoke(d, r, cb, pe, pef, type).then(res => res) };
function json(d, r, cb = defaultJSONFetch, pe, pef, type = "json") { return invoke(d, r, cb, pe, pef, type).then(res => res) };

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
