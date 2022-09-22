module.exports = {
    "usage": "",
    "options": {
        "dir": {
            "alias": "dir [dirname]",
            "describe": "Search the relevant directory",
            "type": "string",
            "demandOption": true,
            "positional": [
                {
                    "name": "dirname",
                    "properties": {
                        "describe": "The relevant directory path",
                        "default": "./"
                    }
                }
            ],
            "file": {
                "path": "./test_function.js"
            }
        },
        "search": {
            "alias": "search [dirname] [searchtext]",
            "describe": "Search the relevant directory",
            "type": "string",
            "demandOption": true,
            "positional": [
                {
                    "name": "dirname",
                    "properties": {
                        "describe": "The relevant directory path",
                        "default": "./"
                    }
                },
                {
                    "name": "searchtext",
                    "properties": {
                        "describe": "The relevant text to search",
                        "default": "./"
                    }
                }
            ],
            "file": {
                "path": "./test_function.js"
                // "function": "run"
            }
        }
    }
}