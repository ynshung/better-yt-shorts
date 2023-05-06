const browserObj = (typeof browser === 'undefined') ? chrome : browser;
const version = browserObj.runtime.getManifest().version;

browserObj.runtime.setUninstallURL("https://github.com/ynshung/better-yt-shorts/blob/master/UNINSTALL.md");