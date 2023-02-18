let file = document.getElementById("file");
let container = document.getElementById("container");
let button = document.getElementById("upload-button");
let text = document.getElementById("filename");
let loader = document.getElementById("loader");

file.addEventListener("change", () => {
  if (file.files[0]) {
    button.disabled = false;
    text.textContent = file.files[0].name;
  } else {
    button.disabled = true;
    text.textContent = "No file selected.";
  }
});
button.addEventListener("click", () => {
  loader.style.display = "block";
  container.style.display = "none";
  button.style.display = "none";

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
        button.style.display = "block";
        loader.style.display = "none";
        button.disabled = true;
      }
    })
    .catch(() => {
      text.textContent = "Error in update process, try again.";
      loader.style.display = "none";
      container.style.display = "block";
      button.style.display = "block";
      button.disabled = true;
    });
});
