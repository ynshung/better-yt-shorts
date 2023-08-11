import React from 'react'
import { PolyDictionary, PopupPageNameEnum, StrictPolyDictionary } from '../lib/definitions'
import { capitalise, getEnumWithString } from '../lib/utils'

import { MdSettings } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";

import { MdCreate } from "react-icons/md";
import { MdOutlineCreate } from "react-icons/md";

// import { MdOutlineVisibilityOff } from "react-icons/md";
// import { MdOutlineVisibility } from "react-icons/md"; // might be good for the features checkbox?

import { MdOutlineRemoveCircleOutline} from "react-icons/md";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { saveSettingsToStorage } from '../lib/SaveToStorage';

interface Props
{
  page: string
  setCurrentPage: ( page: PopupPageNameEnum ) => void
  isCurrentPage: boolean
}

const ICONS = {
  "OPTIONS": {
    active:   <MdSettings/>,
    inactive: <MdOutlineSettings/>
  },
  "KEYBINDS": {
    active:   <MdCreate/>,
    inactive: <MdOutlineCreate/>
  },
  "FEATURES": {
    active:   <MdOutlineRemoveCircle/>,
    inactive: <MdOutlineRemoveCircleOutline/>
  }
} as StrictPolyDictionary

export default function PageIndicator( { page, setCurrentPage, isCurrentPage }: Props ) {

  function handlePageIndicatorClick()
  {
    setCurrentPage( getEnumWithString( PopupPageNameEnum, page, 1 ) )
  }

  function getIndicatorIcon()
  {
    if ( !ICONS[ page ] ) return <></>
    return isCurrentPage ? ICONS[ page ].active : ICONS[ page ].inactive
  }

  const classForIcon = ( isCurrentPage ) ? "--page-indicator-active" : "--page-indicator"
  
  return (
    <button onClick={ handlePageIndicatorClick } className={classForIcon}>
      <span>
        { getIndicatorIcon() }
      </span>
    </button>
  )
}
