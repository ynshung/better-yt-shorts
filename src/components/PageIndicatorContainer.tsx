import React from 'react'
import PageIndicator from './PageIndicator'
import { PolyDictionary, PopupPageNameEnum } from '../lib/definitions'
import { getEnumEntries } from '../lib/utils'

interface Props
{
  currentPage: PopupPageNameEnum 
  setCurrentPage: ( newPage: PopupPageNameEnum ) => void
  setSettingsState: ( settings: PolyDictionary ) => void
}

export default function PageIndicatorContainer( { currentPage, setCurrentPage, setSettingsState }: Props ) {

  function populatePageIndicators()
  {
    return getEnumEntries( PopupPageNameEnum ).map( ([name, page]) => {
      if ( name === "UNKNOWN" ) return
      
      const isCurrentPage = currentPage === page

      const props = { page: name, setCurrentPage, isCurrentPage, setSettingsState }
      
      return <PageIndicator key={ crypto.randomUUID() } { ...props }/>
    } )
  }

  return (
    <div className="--page-indicator-container">
      { populatePageIndicators() }
    </div>
  )
}
