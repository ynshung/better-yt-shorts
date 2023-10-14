import {
  DEFAULT_FEATURES,
  FEATURES_ORDER,
  setFeature,
} from "../lib/declarations";
import { determineInputType } from "../lib/utils";
import { PolyDictionary } from "../lib/definitions";
import { disableAllFeatures, enableAllFeatures } from "../lib/ResetDefaults";
import { saveFeaturesToStorage } from "../lib/SaveToStorage";
import { useEffect, useState } from "react";
import local from "../background/i18n";

interface Props {
  featuresState: PolyDictionary;
  setFeaturesState: (
    features: (previousState: PolyDictionary) => PolyDictionary,
  ) => void;
}

export default function FeaturesPage({
  featuresState,
  setFeaturesState,
}: Props) {
  // this only exists to rerender on change

  const [buttonEnablesAll, setButtonEnablesAll] = useState(true); // ! - change

  useEffect(() => {
    setButtonEnablesAll(() => {
      if (featuresState === null) return true;
      const featuresStateLength = Object.keys(featuresState).length;
      return (
        Object.values(featuresState).filter((feature: boolean) => feature)
          .length !== featuresStateLength
      );
    });
  }, [featuresState]);

  function handleResetFeaturesClick() {
    setFeaturesState(() => {
      let newState;

      if (buttonEnablesAll) newState = enableAllFeatures();
      else newState = disableAllFeatures();

      return newState;
    });
  }

  function handleFeatureChange(e: any, feature: string) {
    const value = e.target.checked;

    setFeaturesState(() => {
      const newState = setFeature(featuresState, feature, value);

      saveFeaturesToStorage(newState);
      console.log(`[BYS] :: Set Feature "${feature}" to ${value}`);

      return newState;
    });
  }

  function populateFeaturesPage() {
    if (featuresState === null) return <></>;

    return FEATURES_ORDER.map((feature: string, i: number) => {
      const value = featuresState[feature];

      if (featuresState === null) return;

      return (
        <div key={i} className="label_input--row">
          <label htmlFor={`feature_input_${feature}`}>{`${local(
            "enable",
            local(feature),
          )}`}</label>
          <input
            id={`features_${feature}`}
            type="checkbox"
            name={`feature_input_${feature}`}
            onChange={(e) => handleFeatureChange(e, feature)}
            checked={value}
          />
        </div>
      );
    });
  }

  return (
    <>
      <h3 className="prevent-selection popup_subheading">
        {local("toggleFeatures")}
      </h3>

      <div id="extra_features">{populateFeaturesPage()}</div>

      <p className="prevent-selection page-warning">
        {local("changesAffectNewShorts")}
      </p>

      <footer className="--flex-button-container">
        <button
          onClick={handleResetFeaturesClick}
          className="--flex-button good"
        >
          {buttonEnablesAll ? local("enableAll") : local("disableAll")}
        </button>
      </footer>
    </>
  );
}
