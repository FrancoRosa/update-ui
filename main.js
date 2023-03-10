const { exec, execSync } = require("node:child_process");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const {
  password,
  patchFiles,
  readFile,
  createLog,
  reboot,
  removeLogs,
} = require("./helpers.js");
const temporalDir = "/tmp/tundra";
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.css", (req, res) => {
  res.sendFile(path.join(__dirname, "index.css"));
});

app.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "index.js"));
});

app.post("/media/add", (req, res) => {
  const { file } = req.files;
  let message = "success";
  console.log("... file input");
  console.log("... create temporal dir");
  execSync(`mkdir -p ${temporalDir}`);
  // execSync(`mkdir -p ${softwareDir}`);
  console.log("... create update path");
  const updatePath = `${temporalDir}/${file.name}`;
  file.mv(updatePath, (err) => {
    if (err) console.log(err);
    exec(`ls ${updatePath}`, (err, stdout, stderr) => {
      console.log("temp file was created");
      if (stdout.includes(file.name)) {
        console.log("...move to temporal dir and unzip file");
        exec(
          `cd ${temporalDir} && unzip -uoP ${password} ${updatePath}`,
          (err, stdout, stderr) => {
            logs = stdout.split("\n");
            logs.forEach((log) => {
              if (log.length > 0) createLog(log);
            });
            if (err) {
              console.error(err);
            } else {
              console.log("... removed zip file");
              execSync(`rm -vf ${updatePath}`);
              const filesFound = execSync(`ls -R ${temporalDir}`).toString();
              const requisites = ["info.json"];
              if (
                requisites
                  .map((e) => filesFound.includes(e))
                  .some((x) => x == false)
              ) {
                console.log("... files missing");
                createLog("Error in the file, files missing");
                message = "error in the file";
              } else {
                console.log("... files ok", updatePath);
                try {
                  patchFiles(updatePath);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        );
      }
    });
  });

  res.send({ message });
});

app.get("/logs", (req, res) => {
  let logs = readFile(__dirname + "/logs.txt");
  logs = logs.split("\n").reverse();
  res.send({ response: logs.join("\n") });
});

app.get("/logs/clear", (req, res) => {
  removeLogs();
  res.send({ response: "ok" });
});

app.get("/reboot", (req, res) => {
  reboot();
  res.send({ response: "ok" });
});

const port = 8000;
server.listen(port, () => {
  console.log("... update service listening on", port);
  createLog("System start");
});
