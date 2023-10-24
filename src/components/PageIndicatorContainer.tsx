import React from "react";
import PageIndicator from "./PageIndicator";
import { PopupPageNameEnum } from "../lib/definitions";
import { getEnumEntries } from "../lib/utils";
import { MdWeb } from "react-icons/md";
import local from "../background/i18n";

interface Props {
  currentPage: PopupPageNameEnum;
  setCurrentPage: (newPage: PopupPageNameEnum) => void;
}

export default function PageIndicatorContainer({
  currentPage,
  setCurrentPage,
}: Props) {
  function populatePageIndicators() {
    return getEnumEntries(PopupPageNameEnum).map(([name, page]) => {
      if (name === "UNKNOWN") return;

      const isCurrentPage = currentPage === page;

      const props = {
        page: name,
        setCurrentPage,
        isCurrentPage,
      };

      return <PageIndicator key={crypto.randomUUID()} {...props} />;
    });
  }

  return (
    <div className="--page-indicator-container">
      {populatePageIndicators()}
      <a
        href="https://github.com/ynshung/better-yt-shorts"
        target="_blank"
        className="--page-indicator"
        title={local("website")}
        rel="noreferrer"
      >
        <span>
          <MdWeb />
        </span>
      </a>
    </div>
  );
}
