// Function to toggle between light and dark themes
function toggleTheme() {
  // Get the current theme or default to light
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";

  // Toggle the theme
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Set the new theme attribute
  document.documentElement.setAttribute("data-theme", newTheme);

  // Save the theme preference to localStorage
  localStorage.setItem("theme", newTheme);

  // Update all checkbox states to match the theme
  const checkboxes = document.querySelectorAll(
    '.theme-switch input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = newTheme === "dark";
  });
}

// Function to initialize theme based on user preference
function initializeTheme() {
  // Check for saved theme preference or use prefer-color-scheme
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // Apply saved theme
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Update checkbox state
    const isDark = savedTheme === "dark";
    const checkboxes = document.querySelectorAll(
      '.theme-switch input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isDark;
    });
  } else {
    // Check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      const checkboxes = document.querySelectorAll(
        '.theme-switch input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    }
  }
}

// Initialize theme when DOM loads
document.addEventListener("DOMContentLoaded", initializeTheme);
