

const fs = require('fs').promises;
const path = require('path');
const { resolve, dirname, join } = path;
const { traversePath, getDirectorySize, traverseFS } = require("../index.js")

traversePath("./", console.log, shouldRecurse = false)
