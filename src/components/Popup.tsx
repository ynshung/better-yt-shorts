import React, { useEffect, useState } from "react";
import "../css/popup.css";
import Header from "./Header";
import KeybindsPage from "./KeybindsPage";
import OptionsPage from "./OptionsPage";
import Separator from "./Separator";
import PageIndicatorContainer from "./PageIndicatorContainer";
import {
  BooleanDictionary,
  ChangedObjectStateEnum,
  PolyDictionary,
  PopupPageNameEnum,
  StringDictionary,
} from "../lib/definitions";
import {
  retrieveFeaturesFromStorage,
  retrieveKeybindsFromStorage,
  retrieveOptionsFromStorage,
} from "../lib/retrieveFromStorage";
import { pingChanges } from "../lib/chromeEmitters";
import {
  DEFAULT_FEATURES,
  DEFAULT_KEYBINDS,
  DEFAULT_OPTIONS,
  DEFAULT_SETTINGS,
} from "../lib/declarations";
import FeaturesPage from "./FeaturesPage";
import local from "../background/i18n";
import Announcement from "./Announcement";

// todo  - split this into its component parts

function Popup() {
  const [keybindsState, setKeybindsState] =
    useState<StringDictionary>(DEFAULT_KEYBINDS);
  const [optionsState, setOptionsState] =
    useState<PolyDictionary>(DEFAULT_OPTIONS);
  const [featuresState, setFeaturesState] =
    useState<BooleanDictionary>(DEFAULT_FEATURES);
  const [settingsState, setSettingsState] =
    useState<PolyDictionary>(DEFAULT_SETTINGS);

  const [currentPage, setCurrentPage] = useState(PopupPageNameEnum.KEYBINDS);

  const keybindsProp = { keybindsState, setKeybindsState };
  const optionsProp = { optionsState, setOptionsState };
  const featuresProp = { featuresState, setFeaturesState };

  const currentPageProps = { currentPage, setCurrentPage, setSettingsState };

  useEffect(() => {
    // retrieve settings
    retrieveOptionsFromStorage(setOptionsState);
    retrieveKeybindsFromStorage(setKeybindsState);
    retrieveFeaturesFromStorage(setFeaturesState);
    // retrieveFeaturesFromStorage( setSettingsState )

    pingChanges(ChangedObjectStateEnum.KEYBINDS, keybindsState as Object);
    pingChanges(ChangedObjectStateEnum.OPTIONS, optionsState as Object);
    pingChanges(ChangedObjectStateEnum.FEATURES, featuresState as Object);
    // pingChanges( ChangedObjectStateEnum.SETTINGS, settingsState as Object )
  }, []);

  function getCurrentPageContent() {
    if (currentPage === PopupPageNameEnum.KEYBINDS)
      return <KeybindsPage {...keybindsProp} />;
    if (currentPage === PopupPageNameEnum.OPTIONS)
      return <OptionsPage {...optionsProp} />;
    if (currentPage === PopupPageNameEnum.FEATURES)
      return <FeaturesPage {...featuresProp} />;
  }

  return (
    <div className="container" data-theme="light">
      <Announcement />
      <div className="content-container">
        <Header />

        <Separator />

        {getCurrentPageContent()}

        <div id="edit-modal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                Edit keybind:{" "}
                <span className="modal-title" id="modal-title-span" />
              </div>
              <span className="close-btn">×</span>
            </div>
            <div className="separation-line" style={{ opacity: "0.5" }} />
            <div className="input-wrapper">
              <label htmlFor="keybind-input" className="prevent-selection">
                {local("pressKeybinds")}
              </label>
              <input type="text" id="keybind-input" />
              <div
                className="prevent-selection"
                style={{ opacity: "0.8", fontSize: 10 }}
              >
                {local("notSupportKeyCombo")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="page-indicator">
        <PageIndicatorContainer {...currentPageProps} />
      </div>
    </div>
  );
}

export default Popup;
