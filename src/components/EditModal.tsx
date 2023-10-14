import React, { useEffect, useRef, useState } from "react";
import Separator from "./Separator";
import {
  DEFAULT_PRESSED_KEY,
  DISABLED_BIND_STRING,
  EXCLUDED_KEY_BINDS,
} from "../lib/declarations";
import { StringDictionary } from "../lib/definitions";
import { saveKeybindsToStorage } from "../lib/SaveToStorage";
import local from "../background/i18n";

interface Props {
  selectedCommand: string;
  isModalOpen: boolean;
  setIsModalOpen: (newState: boolean) => void;
  keybindsState: StringDictionary;
  setKeybindsState: (keybinds: () => StringDictionary) => void; // ! - use proper type
}

export default function EditModal({
  selectedCommand,
  isModalOpen,
  setIsModalOpen,
  keybindsState,
  setKeybindsState,
}: Props) {
  const [inputSuccessString, setInputSuccessString] = useState<string | null>(
    null,
  );
  const [inputErrorString, setInputErrorString] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState(DEFAULT_PRESSED_KEY); // ? this is only to display this to user

  // this only exists to autofocus so inputs are immediate
  const modalRef = useRef(null);
  useEffect(() => {
    if (!isModalOpen) return;

    const el = modalRef?.current as HTMLElement | null;
    if (el) el.focus();
  }, [isModalOpen]);

  useEffect(() => {
    if (
      pressedKey === DEFAULT_PRESSED_KEY ||
      pressedKey === DISABLED_BIND_STRING
    )
      return;

    setInputErrorString(null);
    setInputSuccessString(null);

    if (canUseKey())
      setInputSuccessString(`${local("keyCanBeUsed", pressedKey)}`);
  }, [pressedKey]);

  let currentKey = "";
  if (keybindsState !== null) currentKey = keybindsState[selectedCommand];

  function handleCloseModal() {
    setIsModalOpen(false);

    setInputErrorString(null);
    setInputSuccessString(null);
    setPressedKey(DEFAULT_PRESSED_KEY);
  }

  function handleSaveBind() {
    if (canUseKey()) {
      setKeybindsState(() => {
        const newState = { ...keybindsState };
        newState[selectedCommand] = pressedKey;

        saveKeybindsToStorage(newState);
        console.log(`[BYS] :: Bound key "${pressedKey}" to ${selectedCommand}`);

        return newState;
      });
    }

    setIsModalOpen(false);

    setInputErrorString(null);
    setInputSuccessString(null);
    setPressedKey(DEFAULT_PRESSED_KEY);
  }

  function canUseKey() {
    if (EXCLUDED_KEY_BINDS.includes(pressedKey)) {
      setInputErrorString(`${local("keyCannotBeUsed", pressedKey)}`);
      return false;
    }
    if (Object.values(keybindsState as Object).includes(pressedKey)) {
      setInputErrorString(`${local("keyAlreadyInUse", pressedKey)}`);
      return false;
    }

    return true;
  }

  function showInputInfoString() {
    // either show the success, failure or
    if (inputSuccessString)
      return (
        <div className="--modal-input-success">{`👍 ${inputSuccessString}`}</div>
      );
    if (inputErrorString)
      return (
        <div className="--modal-input-error">{`❌ ${inputErrorString}`}</div>
      );

    return <div className="--modal-input-error">{"\u00A0"}</div>;
  }

  function handleDisableBind() {
    setKeybindsState(() => {
      const newState = { ...keybindsState };
      newState[selectedCommand] = DISABLED_BIND_STRING;

      saveKeybindsToStorage(newState);
      console.log(
        `[BYS] :: Disabled binding "${pressedKey}" that was bound to ${selectedCommand}`,
      );

      setInputSuccessString(
        `${local("disableKeybind", local(selectedCommand))}`,
      );
      return newState;
    });

    setPressedKey(DISABLED_BIND_STRING);
  }

  function getCurrentKeybindString() {
    if (currentKey === DISABLED_BIND_STRING)
      return <>{local("keybindDisabled")}</>;

    return <>{local("currentKeybind", currentKey)}</>;
  }

  function showConfirmButton() {
    if (!inputSuccessString || inputSuccessString.includes("disabled"))
      return <></>;

    return (
      <button className="--flex-button good" onClick={handleSaveBind}>
        {local("confirm")}
      </button>
    );
  }

  return (
    <dialog
      className="--modal"
      open={isModalOpen}
      style={{ display: isModalOpen ? "flex" : "none" }}
      ref={modalRef}
      onKeyDown={(e) => setPressedKey(e.code)}
    >
      <div className="--modal-content">
        <span className="--modal-header">
          <span className="--modal-header-text">
            {local("editBinding")}
            <span className="--modal-command">{local(selectedCommand)}</span>
          </span>

          <span className="close-btn" onClick={handleCloseModal}>
            ×
          </span>
        </span>

        <Separator />

        <div className="input-wrapper">
          <label
            htmlFor="keybind-input"
            className="prevent-selection --modal-label"
          >
            {getCurrentKeybindString()}
          </label>
          <span className="">{pressedKey}</span>
          {showInputInfoString()}
          <div className="--flex-button-container">
            <button className="--flex-button" onClick={handleDisableBind}>
              {local("disableBind")}
            </button>
            {showConfirmButton()}
          </div>
          <div className="prevent-selection key-combo-warning">
            {local("notSupportKeyCombo")}
          </div>
        </div>
      </div>
    </dialog>
  );
}
