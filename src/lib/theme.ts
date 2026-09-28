export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before first paint so the stored theme never flashes.
// Light is the default; dark only when the visitor picked it with the toggle.
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}})();`;
