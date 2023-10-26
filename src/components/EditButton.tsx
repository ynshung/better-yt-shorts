import React from "react";

import { MdCreate } from "react-icons/md";

interface Props {
  command: string;
  setSelectedCommand: (newState: string) => void;
  setIsModalOpen: (newState: boolean) => void;
}
export default function EditButton({
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
      onClick={() => handleEditButtonClick(command)}
    >
      <MdCreate />
    </button>
  );
}
