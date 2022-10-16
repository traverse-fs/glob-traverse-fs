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

Usage:

```

    traverse.dir(
      directory = "./", 
      recursive = false, 
      fetchModifierCallback = traverse.defaultFetch, 
      handleProcessExit = false, 
      errorHandler = defaultErrorHandler, 
      returnType = "nestedarray"
    )

```

- traverse.returnNestedArray

Usage:

```

    traverse.returnNestedArray(
      directory = "./", 
      recursive = false, 
      fetchModifierCallback = traverse.defaultFetch, 
      handleProcessExit = false, 
      errorHandler = traverse.defaultErrorHandler, 
      type = "nestedarray"
    )

```

- traverse.returnFlatArray

Usage:

```

    require("traverse-fs").returnFlatArray(
      directory = "./", 
      recursive = false, 
      fetchModifierCallback = traverse.defaultFetch, 
      handleProcessExit = false, 
      errorHandler = traverse.defaultErrorHandler, 
      type = "flatarray"
    )

```

- traverse.returnJSON

Usage:

```

    require("traverse-fs").returnJSON(
      directory = "./", 
      recursive = false, 
      fetchModifierCallback = traverse.jsonFetch, 
      handleProcessExit = false, 
      errorHandler = traverse.defaultErrorHandler, 
      type = "json"
    )

```

- traverse.callbacks
Usage for traverse.callbacks Function APIs.

While the structure of the callback returns have to be the same, you can run your own modifier functions on the files and folders as needed.
This allows for changing the files, or folder contents or run any jobs on them, if needed.

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

- traverse.search

- traverse.regex

- traverse.cliargs


# Contribution

Please feel to make contributions or raise issues to the repository by creating a pull request or [raising an issue](https://github.com/ganeshkbhat/glob-traverse-fs/issues)

# License

[MIT License](./LICENSE)
