import React, { useState } from "react";
import { DEFAULT_KEYBINDS, KEYBINDS_ORDER } from "../lib/declarations";
import EditButton from "./EditButton";
import { resetKeybinds } from "../lib/ResetDefaults";
import { StringDictionary } from "../lib/definitions";
import EditModal from "./EditModal";
import local from "../background/i18n";

interface Props {
  setKeybindsState: (keybinds: () => StringDictionary) => void;
  keybindsState: StringDictionary;
}

export default function KeybindsPage({
  setKeybindsState,
  keybindsState,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("Seek Backward");

  const modalProps = {
    selectedCommand,
    isModalOpen,
    setIsModalOpen,
    keybindsState,
    setKeybindsState,
  };

  function handleResetKeybinds() {
    setKeybindsState(() => {
      resetKeybinds();
      return DEFAULT_KEYBINDS;
    });
  }

  function populateKeybindsPage() {
    if (keybindsState === null) return <></>;

    return KEYBINDS_ORDER.map((command: string) => {
      const bind = keybindsState[command];
      const editButtonProps = {
        command,
        setSelectedCommand,
        setIsModalOpen,
      };

      return (
        <tr key={crypto.randomUUID()}>
          <td>{local(command)}</td>
          <td>
            <div className="keybind-wrapper">
              <span id={`${command}-span`} className="keybind-span">
                {bind}
              </span>
            </div>
          </td>
          <td>
            <EditButton {...editButtonProps} />
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <h3 className="popup_subheading prevent-selection">
        {local("keybinds")}
      </h3>

      <EditModal {...modalProps} />

      <table style={{ width: "100%" }} data-theme="light" id="keybind-table">
        <tbody>
          <tr className="prevent-selection">
            <th>{local("command")}</th>
            <th>{local("key")}</th>
            <th></th>
          </tr>

          {populateKeybindsPage()}
        </tbody>
      </table>

      <footer className="--flex-button-container">
        <button onClick={handleResetKeybinds} className="--flex-button warn">
          {local("resetKB")}
        </button>
      </footer>
    </>
  );
}
