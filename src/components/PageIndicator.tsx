import React from "react";
import { PopupPageNameEnum, IconDictionary } from "../lib/definitions";

import { MdVideoSettings } from "react-icons/md";
import { MdOutlineVideoSettings } from "react-icons/md";

import { MdKeyboard } from "react-icons/md";
import { MdOutlineKeyboard } from "react-icons/md";

import { MdVisibilityOff } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";

import local from "../background/i18n";

interface Props {
  page: string;
  setCurrentPage: (page: PopupPageNameEnum) => void;
  isCurrentPage: boolean;
}

const ICONS: IconDictionary = {
  OPTIONS: {
    active: <MdVideoSettings />,
    inactive: <MdOutlineVideoSettings />,
    name: local("extraOptions"),
  },
  KEYBINDS: {
    active: <MdKeyboard />,
    inactive: <MdOutlineKeyboard />,
    name: local("keybinds"),
  },
  FEATURES: {
    active: <MdVisibilityOff />,
    inactive: <MdOutlineVisibilityOff />,
    name: local("toggleFeatures"),
  },
};

export default function PageIndicator({
  page,
  setCurrentPage,
  isCurrentPage,
}: Props) {
  function handlePageIndicatorClick() {
    setCurrentPage(PopupPageNameEnum[page as keyof typeof PopupPageNameEnum]);
  }

  function getIndicatorIcon() {
    if (!ICONS[page]) return <></>;
    return isCurrentPage ? ICONS[page].active : ICONS[page].inactive;
  }

  const classForIcon = isCurrentPage
    ? "--page-indicator-active"
    : "--page-indicator";
  const pageTitle = ICONS[page].name;

  return (
    <button
      onClick={handlePageIndicatorClick}
      className={classForIcon}
      title={pageTitle}
    >
      <span>{getIndicatorIcon()}</span>
    </button>
  );
}
