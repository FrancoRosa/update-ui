let file = document.getElementById("file");
let container = document.getElementById("container");
let uploadButton = document.getElementById("upload-button");
let rebootButton = document.getElementById("reboot-button");
let logsButton = document.getElementById("logs-button");
let clearLogsButton = document.getElementById("clear-logs-button");
let logs = document.getElementById("logs");
let text = document.getElementById("filename");
let loader = document.getElementById("loader");
let showLogs = false;

clearLogsButton.style.display = "none";

file.addEventListener("change", () => {
  if (file.files[0]) {
    uploadButton.disabled = false;
    text.textContent = file.files[0].name;
  } else {
    uploadButton.disabled = true;
    text.textContent = "No file selected.";
  }
});

uploadButton.addEventListener("click", () => {
  loader.style.display = "block";
  container.style.display = "none";
  uploadButton.style.display = "none";

  let formData = new FormData();
  formData.append("file", file.files[0], file.files[0].name);
  fetch("/media/add", { method: "POST", body: formData })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      if (json.message.includes("success")) {
        text.textContent = "Successfully updated.";
        loader.style.display = "none";
        container.style.display = "none";
      } else {
        text.textContent = "Error in update process, try again.";
        container.style.display = "block";
        uploadButton.style.display = "block";
        loader.style.display = "none";
        uploadButton.disabled = true;
      }
    })
    .catch(() => {
      text.textContent = "Error in update process, try again.";
      loader.style.display = "none";
      container.style.display = "block";
      uploadButton.style.display = "block";
      uploadButton.disabled = true;
    });
});

logsButton.addEventListener("click", () => {
  showLogs = !showLogs;
  if (showLogs) {
    logsButton.innerText = "Hide logs";
    logs.style.display = "block";
    clearLogsButton.style.display = "block";
  } else {
    logsButton.innerText = "Show logs";
    logs.style.display = "none";
    clearLogsButton.style.display = "none";
  }

  fetch("/logs")
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      logs.innerText = json.response;
    })
    .catch((e) => {
      console.log(e);
    });

  console.log("logs");
});

rebootButton.addEventListener("click", () => {
  rebootButton.innerText = "Rebooting ...";
  rebootButton.disabled = true;
  setTimeout(() => {
    location.reload();
  }, 5000);

  fetch("/reboot");
  console.log("reboot");
});

clearLogsButton.addEventListener("click", () => {
  fetch("/logs/clear").then((res) => {
    logs.style.display = "none";
    clearLogsButton.style.display = "none";
    showLogs = false;
    logsButton.innerHTML = "Show Logs";
  });
  console.log("clear");
});
