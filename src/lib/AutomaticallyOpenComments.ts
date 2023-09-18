import { StateObject } from "./definitions";
import { getCommentsButton, getCurrentId, isCommentsPanelOpen } from "./getters";


export function handleAutomaticallyOpenComments( state: StateObject, options: any )
{
  if( shouldOpenComments( state, options ) )
    openComments()
}

function openComments()
{
  getCommentsButton()?.click()
}

function shouldOpenComments( state: StateObject, options: any )
{
  let currentId = getCurrentId()

  if ( options === null )                       return false
  if ( !options.automatically_open_comments )   return false
  if ( currentId === state.skippedId )          return false // prevents opening comments on skipped shorts
  if ( currentId === state.openedCommentsId )   return false // allow closing of comments

  // change here to prevent bugs with closing comments on previous shorts
  state.openedCommentsId = currentId 

  if ( isCommentsPanelOpen() )                  return false

  return true
}