import React from "react";

import { MdInfoOutline } from "react-icons/md";

export default function InfoButton() {
  return (
    <button
      className="edit-btn info-btn"
      aria-label="Supported natively by YouTube"
      onClick={() => alert("Supported natively by YouTube")}
    >
      <MdInfoOutline />
    </button>
  );
}
