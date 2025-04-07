// src/darkMode.js

export function initDarkMode() {
  const userTheme = localStorage.theme;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (userTheme === "dark" || (!userTheme && systemDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function toggleDarkMode() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  } else {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }
}
