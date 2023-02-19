const { execSync } = require("child_process");
const fs = require("fs");
const ps = require("process");

const createPath = (path) => {
  fs.existsSync(path) || fs.mkdirSync(path);
};

const readFile = (path) => {
  let password;
  try {
    const data = fs.readFileSync(path, "utf8");
    password = data.toString();
  } catch (e) {
    console.log("Error:", e.stack);
  }
  return password;
};

const patchFiles = (dir) => {
  let path = dir.replace(".zip", "");
  let instructions = readFile(`${path}/info.json`);
  instructions = JSON.parse(instructions);
  instructions.commands.forEach((e) => {
    execSync(e);
  });
  instructions.files.forEach((e) => {
    execSync(`cp -f ${path}/${e.name} ${e.dir}`);
  });
};

const password = readFile("password.txt");

exports.password = password;
exports.createPath = createPath;
exports.patchFiles = patchFiles;
