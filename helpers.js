const { execSync, exec } = require("child_process");
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
  console.log("Commands");
  instructions.commands.forEach((e) => {
    execSync(e, (err, stout, sterr) => {
      console.log({ e });
      console.log({ err });
      console.log({ stout });
      console.log({ sterr });
    });
  });
  console.log("Files");
  instructions.files.forEach((e) => {
    execSync(`cp -f ${path}/${e.name} ${e.dir}`, (err, stout, sterr) => {
      console.log({ e });
      console.log({ err });
      console.log({ stout });
      console.log({ sterr });
    });
  });
};

const password = readFile("password.txt");

exports.password = password;
exports.createPath = createPath;
exports.patchFiles = patchFiles;
exports.readFile = readFile;
exports.createLog = createLog;
exports.removeLogs = removeLogs;
exports.reboot = reboot;
