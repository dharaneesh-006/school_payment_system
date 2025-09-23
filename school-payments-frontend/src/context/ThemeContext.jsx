import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

// Function to get the initial theme
const getInitialTheme = () => {
  // 1. Check for a saved theme in localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }
  // 2. If no saved theme, check the user's system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  // 3. Default to 'light'
  return "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
