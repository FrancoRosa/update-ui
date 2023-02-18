const { exec, execSync } = require("node:child_process");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const os = require("os");
const fileUpload = require("express-fileupload");
const { event } = require("./helpers");
const softwareDir = `${os.homedir()}/avllc01`;
const temporalDir = "/tmp/avllc01";
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
  event(1, 1);
  execSync(`mkdir -p ${temporalDir}`);
  execSync(`mkdir -p ${softwareDir}`);
  const updatePath = `${temporalDir}/${file.name}`;
  file.mv(updatePath, (err) => {
    if (err) console.log(err);
    exec(`ls ${updatePath}`, (err, stdout, stderr) => {
      if (stdout.includes(file.name)) {
        exec(
          `cd ${temporalDir} && tar -xf ${updatePath}`,
          (err, stdout, stderr) => {
            if (err) {
              console.log(err);
            } else {
              execSync(`rm -vf ${updatePath}`);
              const filesFound = execSync(`ls -R ${temporalDir}`).toString();
              const requisites = ["api_build.js", "build", "index.html"];
              if (
                requisites
                  .map((e) => filesFound.includes(e))
                  .some((x) => x == false)
              ) {
                console.log("... files missing");
              } else {
                console.log("... files ok");
                execSync(`rm -vf ${softwareDir}/api.js`);
                execSync(`rm -rvf ${softwareDir}/build`);
                execSync(`mv ${temporalDir}/* ${softwareDir}/`);
              }
            }
          }
        );
      }
    });
  });

  res.send({ message });
});

const port = 8000;
server.listen(port, () => {
  console.log("... update service listening on", port);
  event(1);
});
