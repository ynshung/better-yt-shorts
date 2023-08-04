import React from 'react'
import { PopupPageNameEnum } from '../lib/definitions'
import { capitalise, getEnumWithString } from '../lib/utils'

interface Props
{
  page: string
  setCurrentPage: ( page: PopupPageNameEnum ) => void
  isCurrentPage: boolean
}

export default function PageIndicator( {page, setCurrentPage, isCurrentPage}: Props ) {

  function handlePageIndicatorClick( page: string )
  {
    setCurrentPage( getEnumWithString( PopupPageNameEnum, page, 0 ) )
  }

  return (
    <button>
      <div className={ isCurrentPage ? "--page-indicator-active" : "--page-indicator" } onClick={ () => handlePageIndicatorClick( page ) }></div>
    </button>
  )
}
