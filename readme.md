# Update ui

> UI to upload files to a temporaly file, then move the files into its desired location based on a instructions file

## Deploy instructions

To run this application `nodejs` must be installed, then the main script `index.js` can be run. It will create a server running on port 8000

## How to use it

Create a folder containing files and a `info.json` file. The json file should contain the update version name, the files needed and the appropriate directions where to save them. Example:

```json
{
  "update": "2023-02-18 - Mark",
  "commands": [],
  "files": [
    { "name": "readme.md", "dir": "/home/pi" },
    { "name": "readme1.md", "dir": "/home/pi" }
  ]
}
```

Then the folder should be password protected to avoid someone else creating any file, the password is saved in `password.txt` on this repo.
