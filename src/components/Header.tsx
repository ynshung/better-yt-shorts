import React from "react";
import { VERSION } from "../lib/declarations";
import bys_logo from "../assets/icons/bys-48.png";
import local from "../background/i18n";

export default function Header() {
    return (
        <header className="title-container">
            <div>
                <div className="title">{local("extName")}</div>
                <div className="version">v<span>{VERSION}</span></div>
            </div>
            <img src={bys_logo} alt="Better Youtube Shorts logo" height="30px" width="auto" />
        </header>
    );
}
