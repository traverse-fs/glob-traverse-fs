/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i traverse-cli, npm i traverse-fs, npm i fssys
 * Github: https://github.com/ganeshkbhat/glob-traverse-fs
 * npmjs Link: 
 * File: cli.args.js
 * File Description: Get CLI Arguments function
 * 
*/

/**
 *
 * getArgsList
 * 
 * @param {*} argList
 * @return {*} 
 * 
 */
function getArgsList(argList) {
    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');
        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        }
        else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
}

module.exports = {
    cliArgs: getArgsList
}

