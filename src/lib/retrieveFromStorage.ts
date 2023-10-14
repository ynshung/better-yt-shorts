import {
  DEFAULT_FEATURES,
  DEFAULT_KEYBINDS,
  DEFAULT_OPTIONS,
  DEFAULT_SETTINGS,
  storage,
} from "./declarations";
import { PolyDictionary, StringDictionary } from "./definitions";

export async function retrieveOptionsFromStorage(
  setter: (options: PolyDictionary) => void,
) {
  const localStorageOptions = JSON.parse(
    localStorage.getItem("yt-extraopts") as string,
  );
  setter(localStorageOptions);

  storage
    .get(["extraopts"])
    .then(({ extraopts }) => {
      if (!extraopts)
        throw Error(
          "[BYS] :: Extra Options couldnt be loaded from storage, using defaults",
        );

      for (const [option, value] of Object.entries(DEFAULT_OPTIONS)) {
        if (extraopts[option]) continue; // * this may be an issue later on if we WANT falsy values as viable values
        extraopts[option] = value;
      }

      if (extraopts !== localStorageOptions)
        localStorage.setItem("yt-extraopts", JSON.stringify(extraopts));

      setter(extraopts);
    })
    .catch((err) => {
      setter(DEFAULT_OPTIONS);
    });
}

export async function retrieveKeybindsFromStorage(
  setter: (keybinds: StringDictionary) => void,
) {
  const localStorageKeybinds = JSON.parse(
    localStorage.getItem("yt-keybinds") as string,
  );
  setter(localStorageKeybinds);

  storage
    .get(["keybinds"])
    .then(({ keybinds }) => {
      if (!keybinds)
        throw Error(
          "[BYS] :: Keybinds couldnt be loaded from storage, using defaults",
        );

      for (const [option, value] of Object.entries(DEFAULT_KEYBINDS)) {
        if (keybinds[option] !== null) continue; // * this may be an issue later on if we WANT falsy values as viable values
        keybinds[option] = value;
      }

      if (keybinds !== localStorageKeybinds)
        localStorage.setItem("yt-keybinds", JSON.stringify(keybinds));

      setter(keybinds);
    })
    .catch((err) => {
      setter(DEFAULT_KEYBINDS);
    });
}

export async function retrieveSettingsFromStorage(
  setter: (settings: Object) => void,
) {
  const localStorageSettings = JSON.parse(
    localStorage.getItem("yt-settings") as string,
  );
  setter(localStorageSettings);

  storage
    .get(["settings"])
    .then(({ settings }) => {
      if (!settings)
        throw Error(
          "[BYS] :: Settings couldnt be loaded from storage, using defaults",
        );

      for (const [option, value] of Object.entries(DEFAULT_SETTINGS)) {
        if (settings[option]) continue; // * this may be an issue later on if we WANT falsy values as viable values
        settings[option] = value;
      }

      if (settings !== localStorageSettings)
        localStorage.setItem("yt-settings", JSON.stringify(settings));

      setter(settings);
    })
    .catch((err) => {
      setter(DEFAULT_SETTINGS);
    });
}

export async function retrieveFeaturesFromStorage(
  setter: (features: Object) => void,
) {
  const localStorageFeatures = JSON.parse(
    localStorage.getItem("yt-features") as string,
  );
  setter(localStorageFeatures);

  storage
    .get(["features"])
    .then(({ features }) => {
      if (!features)
        throw Error(
          "[BYS] :: Features couldnt be loaded from storage, using defaults",
        );

      for (const [feature, value] of Object.entries(DEFAULT_FEATURES)) {
        if (features[feature] !== null) continue;
        features[feature] = value;
      }

      if (features !== localStorageFeatures)
        localStorage.setItem("yt-features", JSON.stringify(features));

      setter(features);
    })
    .catch((err) => {
      setter(DEFAULT_FEATURES);
    });
}
