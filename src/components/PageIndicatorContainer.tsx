import React from 'react'
import PageIndicator from './PageIndicator'
import { PopupPageNameEnum } from '../lib/definitions'
import { getEnumEntries } from '../lib/utils'

interface Props
{
  currentPage: PopupPageNameEnum 
  setCurrentPage: ( newPage: PopupPageNameEnum ) => void
}

export default function PageIndicatorContainer( { currentPage, setCurrentPage }: Props ) {

  function populatePageIndicators()
  {
    return getEnumEntries( PopupPageNameEnum ).map( ([name, page]) => {
      const isCurrentPage = currentPage === page

      const props = { page: name, setCurrentPage, isCurrentPage }
      
      return <PageIndicator key={ crypto.randomUUID() } { ...props }/>
    } )
  }

  return (
    <div className="--page-indicator-container">
      { populatePageIndicators() }
    </div>
  )
}
