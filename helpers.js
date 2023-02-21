const { execSync, exec } = require("child_process");
const { create } = require("domain");
const fs = require("fs");

const createPath = (path) => {
  fs.existsSync(path) || fs.mkdirSync(path);
};

const getTimestamp = () => {
  return new Date().toLocaleString("se-SV");
};

const readFile = (path) => {
  let text;
  try {
    const data = fs.readFileSync(path, "utf8");
    text = data.toString();
  } catch (e) {
    console.log("Error:", e.stack);
  }
  return text;
};

const createLog = (message) => {
  fs.appendFileSync(
    `${__dirname}/logs.txt`,
    `${getTimestamp()} - ${message}\n`
  );
};

const removeLogs = () => {
  fs.writeFileSync(`${__dirname}/logs.txt`, "");
};

const reboot = () => {
  createLog("User reboot");
  execSync("sudo reboot");
};

const patchFiles = (dir) => {
  let path = dir.replace(".zip", "");
  let instructions = readFile(`${path}/info.json`);
  instructions = JSON.parse(instructions);
  createLog("Update: " + instructions.update);
  instructions.instructions.forEach((ins) => {
    let response = "";
    if (ins.type === "file") {
      response = execSync(`cp -vf ${path}/${ins.name} ${ins.dir}`);
    }
    if (ins.type === "command") {
      createLog("Command: " + ins.name);

      response = execSync(ins.name);
    }
    response = response.toString().split("\n");
    console.log(response);
    response.forEach((line) => {
      if (line.length > 0) createLog(line);
    });
  });
};

const password = readFile(`${__dirname}/password.txt`);

exports.password = password;
exports.createPath = createPath;
exports.patchFiles = patchFiles;
exports.readFile = readFile;
exports.createLog = createLog;
exports.removeLogs = removeLogs;
exports.reboot = reboot;
