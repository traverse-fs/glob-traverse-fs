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

You can use the directory/ folder traversing and get a return of a nested array (array of arrays) as the result.

```

var traverse = require("traverse-fs);
var path = require("path");
traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "nestedarray").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "nestedarray").then(console.log);

```

#### Simple - Return Single Level Array

You can use the directory/ folder traversing and get a return of a single level array as the result. The result will have the complete path of the file in case the file being in the sub directory.

```

var traverse = require("traverse-fs);
var path = require("path");
traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "flatarray").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "flatarray").then(console.log);

```

#### Simple - Return JSON

```

var traverse = require("traverse-fs);
var path = require("path");
traverse.dir("./", false, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "json").then(console.log);

// Alternatively, you can specify specific callbacks of your own and go recursive traversing
traverse.dir("./", true, (dir, file) => { return path.join(dir, file.name) }, true, (error) => { console.log(error); }, "json").then(console.log);

```

#### Simple - Simple Search usage

TODO

#### Simple - Simple Search usage with Return Nested Array

TODO

#### Simple - Simple Search usage with Return Single Level Array

TODO

#### Simple - Simple Search usage with Return JSON

TODO

#### CLI - Simple CLI Get usage

TODO

#### CLI - Simple CLI Search usage

TODO

#### API for traverse-fs / fssys

- traverse.dir

Usage with their default implementations:

```

    traverse.dir(
      directory = "./",
      recursive = false,
      fetchModifierCallback = traverse.defaultFetch,
      handleProcessExit = false,
      errorHandler = traverse.defaultErrorHandler,
      type = "nestedarray",
      options = { before: () => { }, after: () => { } }
    )

```

- traverse.returnNestedArray

Usage with their default implementations:

```

    traverse.returnNestedArray(
      directory = "./",
      recursive = false,
      fetchModifierCallback = traverse.defaultFetch,
      handleProcessExit = false,
      errorHandler = traverse.defaultErrorHandler,
      type = "nestedarray",
      options = { before: () => { }, after: () => { } }
    )

```

- traverse.returnFlatArray

Usage with their default implementations:

```

    traverse.returnFlatArray(
      directory = "./",
      recursive = false,
      fetchModifierCallback = traverse.defaultFetch,
      handleProcessExit = false,
      errorHandler = traverse.defaultErrorHandler,
      type = "flatarray",
      options = { before: () => { }, after: () => { } }
    )

```

- traverse.returnJSON

Usage with their default implementations:

```

    traverse.returnJSON(
      directory = "./",
      recursive = false,
      fetchModifierCallback = traverse.jsonFetch,
      handleProcessExit = false,
      errorHandler = traverse.defaultErrorHandler,
      type = "json",
      options = { before: () => { }, after: () => { } }
    )

```

- traverse.callbacks
  Usage for traverse.callbacks Function APIs.

  - traverse.callbacks.defaultFetch

Default Implementation:

```

  (directory, fileDirent) => path.join(directory, fileDirent.name)

```

- traverse.callbacks.jsonFetch

Default Implementation:

```

  (directory, fileDirent) => {
      if ((os.type() === "Windows_NT") && fileDirent.name.includes("\\")) {
          return path.join(fileDirent.name.split("\\").at(-1));
      }
      return path.join(fileDirent.name.split("/").at(-1))
  }

```

- traverse.callbacks.errorHandler

Default Implementation:

```

  (error) => console.log(error)

```

While the structure of the callback's returns have to be the same (the file-folder path join names), you can run your own modifier functions on the files and folders as needed and ensure return of file-folder path join names. This allows for changing the files, or folder contents or run any jobs on them, if needed. You can allow for running your own before and after callbacks inside your custom callback functions as needed. It will depend on how you create your custom callback function.

You can also run your own before and after callbacks before traversing or after traversing the files and folders.

Example:
You can use your own callbacks, modifiers, custom jobs, etc like below:

```

functon cb(directory, fileDirent){

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
