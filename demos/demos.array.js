

const fs = require('fs').promises;
const path = require('path');
const { resolve, dirname, join } = path;
const { traversePath, getDirectorySize, traverseFS } = require("../index.js")

let arr = []
let result = traversePath("./", (path, name, isDir) => arr.push({ path, name, isDir }), shouldRecurse = false)


