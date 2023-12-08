<div align="center">

![BYS Icon](./src/assets/icons/bys-128.png)

# Better YouTube Shorts

![Current Version](https://img.shields.io/amo/v/better-youtube-shorts?label=version)
[![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/pehohlhkhbcfdneocgnfbnilppmfncdg?label=chrome)](https://chrome.google.com/webstore/detail/better-youtube-shorts/pehohlhkhbcfdneocgnfbnilppmfncdg)
[![Firefox Add-on users](https://img.shields.io/amo/users/better-youtube-shorts?label=firefox)](https://addons.mozilla.org/en-US/firefox/addon/better-youtube-shorts)
![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/pehohlhkhbcfdneocgnfbnilppmfncdg)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

</div>

Control your YouTube shorts just like a normal YouTube video! Features include progress bar, seeking, playback speed, auto skip and more. You can also customize the keybinds to your liking!

## Installation

- Chrome Extension: https://chrome.google.com/webstore/detail/better-youtube-shorts/pehohlhkhbcfdneocgnfbnilppmfncdg
- Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/better-youtube-shorts

## Features

- **Progress bar** at the bottom with time and duration
- **Seeking** 5 seconds backward and forward with arrow keys (adjustable time)
- Mini **timestamp** and speed above the like button (can be scrolled on!)
- **Fullscreen** support with F key
- Decrease and increase **playback speed** with keys U and O
- Click the speed button to revert to normal speed or toggle between different speeds
- Toggle to auto skip short when current one ends
- Control volume with the **volume slider** or with - and =, mute audio with M
- **Customizable** keybinds

Extra features:

- Start short from beginning with J
- Auto skip short with likes below custom threshold (e.g. 500 likes)
- Auto open comment section on each short
- Hide overlay on shorts (title, channel, etc.)
- Navigate to previous or next short without animation with W and S
- Go to the next frame or previous frame with . and , while paused
- Upload date above video title

### Screenshots

![image](https://github.com/ynshung/better-yt-shorts/assets/61302840/448f4050-cc7f-4676-b072-8bf2771d4b59)

### Default Keybinds

| Action              | Shortcut   |
| ------------------- | ---------- |
| Seek Backward (+5s) | ArrowLeft  |
| Seek Forward (-5s)  | ArrowRight |
| Decrease Speed      | KeyU       |
| Reset Speed         | KeyI       |
| Increase Speed      | KeyO       |
| Decrease Volume     | Minus      |
| Increase Volume     | Equal      |
| Toggle Full Screen  | KeyF       |
| Toggle Mute         | KeyM       |
| Restart Short       | KeyJ       |
| Next Frame          |            |
| Previous Frame      |            |
| Next Short          |            |
| Previous Short      |            |

Some keybinds are disabled by default. You can enable them by setting its keybinds.

## Contributing

All type of contributions are welcome. You may contribute by reporting bugs, suggesting new features, translating the extension or even by submitting a pull request.

### Translation

Know multiple languages? Help translate the extension so we can have a reach worldwide! See the list of supported locales [here](https://developer.chrome.com/docs/webstore/i18n/#choosing-locales-to-support). You can translate the extension itself or the store listing description which is under the `store-desc/` directory.

#### For beginners

We are currently using POEditor to facilitate the extension localization process for beginners. You can join the project using this [invite link](https://poeditor.com/join/project/QwlUFSANOG). Note that you can choose to translate or copy the `description` as it is just for reference.

To test your translation in the browser, export the file as _Key-Value JSON_, rename the file to `messages.json` and put it in the `_locales/[LANG]` folder where _LANG_ is the code of the language. Make sure the [locale of your browser](https://developer.chrome.com/docs/extensions/reference/i18n/#how-to-set-browsers-locale) is set properly. See the development guide below to build your extension in real-time. Please note that this method haven't been fully tested yet, so please let us know of any issues you faced in the issue page.

If you need any help in translating, you may create an issue or contact us using the Google Form below.

#### For advanced users

Start by forking the repo, copying the `_locales/en/messages.json` file and paste it to your locale code directory. Then, you can start translating the messages in the `messages.json` file. The `description` are just for reference and will not be visible to the user so you may translate it or leave it as it-is.

You can also add help translate the **store listing description** by emailing @ynshung or creating an issue to express your interest. Note that you will be notified to update the description from time to time.

### Issues / Suggestion

If you have faced any issue with the extension or any suggestion that can help to improve the extension, you may create an issue [here](https://github.com/ynshung/better-yt-shorts/issues) or if you know how to code, fork the repo, make the necessary changes and create a pull request.

You may leave your feedback in this [Google Form](https://forms.gle/pvSiMwDeQVfwyALfA).

### Development Guide

1. Fork the project on Github
2. Clone your fork in your local machine
3. Open the working directory in the terminal
4. Run `npm i` to install all dependencies (ensure that [node and npm are installed](https://nodejs.org/en))
5. For **Chrome development**
   1. Run `npm run dev` to start development
   2. Open Chrome and navigate to `chrome://extensions`
   3. Toggle `Developer Mode` with the switch at the top-right of that page
   4. Drag and drop the `dist` directory into that page to load the unpacked extension
   5. **OR** click load unpacked and select the `manifest.json` file in the directory
   6. Changing a file should automatically update and refresh the extension
6. For **Firefox development**
   1. Run `npm run dev:firefox` to start development
   2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   3. Click `Load Temporary Add-on...` and select the `package.json` in the `dist` directory
   4. Everytime a file is changed, make sure to reload the extension after the message of `Firefox manifest created successfully.` is shown.

## License

GNU GPL v3
