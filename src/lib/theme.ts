export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before first paint so the stored theme never flashes.
// Dark is the default; light only when the visitor picked it.
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}})();`;
