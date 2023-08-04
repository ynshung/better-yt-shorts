import React from 'react'
import { VERSION } from '../lib/declarations'
import bys_logo from "../assets/icons/bys-48.png"

export default function Header() {
  return (
    <header className="title-container">
      <div>
        <div className="title">Better Youtube Shorts</div>
        <div className="version">v<span id="version"/>{VERSION}</div>
      </div>
      <img src={bys_logo} alt="Better Youtube Shorts logo" height="30px" width="auto" />
    </header>
)
}
