import { StateObject } from "./definitions";
import { getCommentsButton, getCurrentId } from "./getters";

export function handleAutomaticallyOpenComments(
  state: StateObject,
  options: any,
) {
  if (shouldOpenComments(state, options)) openComments();
}

function openComments() {
  getCommentsButton()?.click();
}

function shouldOpenComments(state: StateObject, options: any) {
  const currentId = getCurrentId();

  if (options === null) return false;
  if (!options.automaticallyOpenComments) return false;
  if (currentId === state.skippedId) return false; // prevents opening comments on skipped shorts
  if (currentId === state.openedCommentsId) return false; // allow closing of comments

  // change here to prevent bugs with closing comments on previous shorts
  state.openedCommentsId = currentId;

  if (isCommentsPanelOpen()) return false;

  return true;
}

function isCommentsPanelOpen() {
  // return true if the selector finds an open panel
  // if panel is unfound, then the short either hasnt loaded, or the panel is not open
  return (
    document.querySelector(
      `[ id="${getCurrentId()}" ] #watch-while-engagement-panel  [ visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED" ]`,
    ) ?? false
  );
}
