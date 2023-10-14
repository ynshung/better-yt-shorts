import React from "react";
import { setKeybind, storage } from "../lib/declarations";
import { StringDictionary } from "../lib/definitions";

import { MdCreate } from "react-icons/md";

interface Props {
  keybindsState: StringDictionary;
  setKeybindsState: any; // ! give specific type
  command: string;
  setSelectedCommand: (newState: string) => void;
  setIsModalOpen: (newState: boolean) => void;
}
export default function EditButton({
  keybindsState,
  setKeybindsState,
  command,
  setSelectedCommand,
  setIsModalOpen,
}: Props) {
  function handleEditButtonClick(command: string): void {
    setIsModalOpen(true);
    setSelectedCommand(command);
  }

  return (
    <button
      id={command}
      className="edit-btn"
      onClick={(e) => handleEditButtonClick(command)}
    >
      <MdCreate />
    </button>
  );
}
