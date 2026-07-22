function toggleMoblieMenu() {
  document.getElementById("menu").classList.toggle("active");
}

let Theme = document.getElementById("Theme");
Theme.onclick = function () {
  document.body.classList.toggle("dark_mode");
  if (document.body.classList.contains("dark_mode")) {
    Theme.id = "sun-icon";
  } else {
    Theme.id = "moon-icon";
  }
};
