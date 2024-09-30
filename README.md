# traverse-fs

Nodejs npm module to traverse files and folder using code, or cli, or use glob patterns

`npm i traverse-fs --save`

<!-- `npm i traverse-cli -g` -->
<!-- `npm i traverse-cli --save` -->

`npm i fssys --save`

# Usage

The API of traverse-fs can be used to traverse a folder or its subfolders recursively.

#### Simple - Usage

You can use `traverse.dir` which by default traverses a single specified folder. However, you can change it to traverse recursively for it sub folders as well. You can find a simple usage of the api as below:

```

var traverse = require("traverse-fs);
var path = require("path");

traverse.dir("./").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }).then(console.log);

```

#### Simple - Return Nested Array

You can use the directory/ folder traversing and get a `return of a nested array (array of arrays)` as the result.

```

var traverse = require("traverse-fs);
var path = require("path");

traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "nestedarray").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "nestedarray").then(console.log);

```

#### Simple - Return Single Level Array

You can use the directory/ folder traversing and get a `return of a single level array` as the result. The result will have the complete path of the file in case the file being in the sub directory.

```

var traverse = require("traverse-fs);
var path = require("path");

traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "flatarray").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "flatarray").then(console.log);

```

#### Simple - Return JSON

You can use the directory/ folder traversing and get a `return of a json` as the result. The result will have the complete path of the file in case the file being in the sub directory.

```

var traverse = require("traverse-fs);
var path = require("path");

traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "json").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "json").then(console.log);

```

#### Simple - Simple Search usage

TODO

<!-- 

{
    search: (d: any, r: any, cb: ((d: any, f: any, searchPattern: any, flag?: undefined) => string | false) | undefined, pe: any, pef: any, type?: string, options?: {
        search: string;
        text: never[];
    }) => void;
    filter: (d: any, r: any, cb: ((d: any, f: any, searchPattern: any, flag?: undefined) => string | false) | undefined, pe: any, pef: any, type?: string, options?: {
        search: string;
        text: never[];
    }) => void;
    regex: (d: any, r: any, cb: ((d: any, f: any, searchPattern: any, flag?: undefined) => string | false) | undefined, pe: any, pef: any, type?: string, options?: {
        regex: string;
        pattern: null;
        text: never[];
    }) => void;
    dir: (directory: any, recursive: any, fetchModifierCallback: any, handleProcessExit: any, errorHandler: any, type: any, options?: {
        before: () => void;
        after: () => void;
    }) => any;
    returnNestedArray: (directory: any, recursive: any, fetchModifierCallback: ((directory: any, fileDirent: any) => string) | undefined, handleProcessExit: any, errorHandler: any, type: string | undefined, options: any) => any;
    returnFlatArray: (directory: any, recursive: any, fetchModifierCallback: ((directory: any, fileDirent: any) => string) | undefined, handleProcessExit: any, errorHandler: any, type: string | undefined, options: any) => any;
    returnJSON: (directory: any, recursive: any, fetchModifierCallback: ((directory: any, fileDirent: any) => string) | undefined, handleProcessExit: any, errorHandler: any, type: string | undefined, options: any) => any;
    callbacks: {
        search: (d: any, f: any, searchPattern: any, flag?: undefined) => string | false;
        searchFiles: (d: any, f: any, searchPattern: any, flag?: undefined) => string | false;
        searchFolder: (d: any, f: any, searchPattern: any, flag?: undefined) => string | false;
        defaultFetch: (directory: any, fileDirent: any) => string;
        jsonFetch: (directory: any, fileDirent: any) => string;
        errorHandler: (error: any) => void;
    };
    cliArgs: (argList: any) => any;
} 

-->



<!-- 
#### Simple - Simple Search usage with Return Nested Array

TODO

#### Simple - Simple Search usage with Return Single Level Array

TODO

#### Simple - Simple Search usage with Return JSON

TODO

#### CLI - Simple CLI Get usage

TODO

#### CLI - Simple CLI Search usage

TODO -->

#### API for traverse-fs / fssys

<br/>

- `traverse.dir` Usage Default implementations:

```
    traverse.dir(
      directory = "./",     // directory to traverse
      recursive = false,    // whether to traverse nested and recursively
      fetchModifierCallback = traverse.defaultFetch,    // any custom result modifiers handler needed
      handleProcessExit = false,    // any custom process exit handler needed
      errorHandler = traverse.defaultErrorHandler,    // any custom error handler needed
      type = "nestedarray",     // return type of results json, nestedarray, flatarray
      options = { before: () => { }, after: () => { } }     // any before after handlers
    )
```

<br/>

- `traverse.returnNestedArray` Usage and Default implementations:


```
    traverse.returnNestedArray(
      directory = "./",     // directory to traverse
      recursive = false,    // whether to traverse nested and recursively
      fetchModifierCallback = traverse.defaultFetch,    // any custom result modifiers handler needed
      handleProcessExit = false,    // any custom process exit handler needed
      errorHandler = traverse.defaultErrorHandler,    // any custom error handler needed
      type = "nestedarray",     // return type of results json, nestedarray, flatarray
      options = { before: () => { }, after: () => { } }     // any before after handlers
    )
```

<br/>

- `traverse.returnFlatArray` Usage and Default implementations:

```
    traverse.returnFlatArray(
      directory = "./",     // directory to traverse
      recursive = false,    // whether to traverse nested and recursively
      fetchModifierCallback = traverse.defaultFetch,    // any custom result modifiers handler needed
      handleProcessExit = false,    // any custom process exit handler needed
      errorHandler = traverse.defaultErrorHandler,    // any custom error handler needed
      type = "flatarray",     // return type of results json, nestedarray, flatarray
      options = { before: () => { }, after: () => { } }     // any before after handlers
    )
```

<br/>

- `traverse.returnJSON` Usage and Default implementations:

```
    traverse.returnJSON(
      directory = "./",     // directory to traverse
      recursive = false,    // whether to traverse nested and recursively
      fetchModifierCallback = traverse.defaultFetch,    // any custom result modifiers handler needed
      handleProcessExit = false,    // any custom process exit handler needed
      errorHandler = traverse.defaultErrorHandler,    // any custom error handler needed
      type = "json",     // return type of results json, nestedarray, flatarray
      options = { before: () => { }, after: () => { } }     // any before after handlers
    )
```

<br/>

### Default callback implementation

<br/>

- traverse.callbacks
  Usage for traverse.callbacks Function APIs.

  - `traverse.callbacks.defaultFetch` Default Implementations:

```
  (directory, fileDirent) => path.join(directory, fileDirent.name)
```
<br/>

- `traverse.callbacks.jsonFetch` Default Implementation:

```
  (directory, fileDirent) => {
      if ((os.type() === "Windows_NT") && fileDirent.name.includes("\\")) {
          return path.join(fileDirent.name.split("\\").at(-1));
      }
      return path.join(fileDirent.name.split("/").at(-1))
  }
```

<br/>

- `traverse.callbacks.errorHandler` Default Implementation:

```
  (error) => console.log(error)
```

<br/>

While the structure of the callback's returns have to be the same (the file-folder path join names), you can run your own modifier functions on the files and folders as needed and ensure return of file-folder path join names. This allows for changing the files, or folder contents or run any jobs on them, if needed. You can allow for running your own before and after callbacks inside your custom callback functions as needed. It will depend on how you create your custom callback function.

You can also run your own before and after callbacks before traversing or after traversing the files and folders.

Example:
You can use your own callbacks, modifiers, custom jobs, etc like below:

```

function cb(directory, fileDirent){

  function modifierFunction(d, f) {

    specifyBeforeCallback();
    /* Your own modifiers, Running custom functions on files or folders, etc. code here*/
    specifyAfterCallback();

  }

  modifierFunction(directory, fileDirent);
  return path.join(directory, fileDirent.name);
}

traverse.dir(
      directory = "./",
      recursive = false,
      fetchModifierCallback = cb,
      handleProcessExit = false,
      errorHandler = traverse.defaultErrorHandler,
      type = "nestedarray",
      options = { before: () => { }, after: () => { } }
    )

```


- traverse.search [TODO]

- traverse.filter [TODO]

- traverse.regex [TODO]

- traverse.cliargs [TODO]

# Contribution

Please feel to make contributions or raise issues to the repository by creating a pull request or [raising an issue](https://github.com/ganeshkbhat/glob-traverse-fs/issues)

# License

[MIT License](./LICENSE)
