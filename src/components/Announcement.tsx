import React, { useState } from "react";
import local from "../background/i18n";

export default function Announcement() {
    const currAnnouncement = 1;

    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const handleDismiss = (no: number) => {
        setShowAnnouncement(false);
        localStorage.setItem("byt-announcement", no.toString());
    };

    const announcementDismissed =
        localStorage.getItem("byt-announcement");

    if (!showAnnouncement || (announcementDismissed !== null && parseInt(announcementDismissed) >= currAnnouncement)) {
        return null;
    }

    return (
        <div className="announcement">
            <a
                href="https://github.com/ynshung/better-yt-shorts#translation"
                target="_blank" rel="noreferrer"
            >
                {local("announcement")}
            </a>
            <a href="#" className="close-btn" title="Dismiss" onClick={() => handleDismiss(currAnnouncement)}>
                &times;
            </a>
        </div>
    );
}
