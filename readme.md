# Update ui

> UI to upload files to a temporaly file, then move the files into its desired location based on a instructions file

## Deploy instructions

To run this application `nodejs` must be installed, then the main script `index.js` can be run. It will create a server running on port 8000

## How to use it

Create a folder containing files and a `info.json` file. The json file should contain the update version name, Example:

```json
{
  "update": "2023-02-18 - Mark",
  "instructions": [
    {
      "type": "file",
      "name": "readme.md",
      "dir": "/home/fx"
    },
    {
      "type": "command",
      "name": "sleep 2"
    }
    {
      "type": "command",
      "name": "ls"
    }
  ]
}
```

Please note that instructions has two types, file and command, the script will execute the operations one by one

Then the folder should be password protected to avoid someone else creating any file, the password is saved in `password.txt` on this repo.
