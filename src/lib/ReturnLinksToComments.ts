import { getComments } from "../lib/getters" 

const prefixRegex = /((https?|ftp|www):\/\/)/
const linkRegex   = /[^\s]+\.[^\s]{2,}/g

// todo - move to getters


export function handleReturnLinksToComments( enabled: boolean )
{
  if ( !enabled ) return

	const comments = getComments()

  comments.forEach( comment => {
    if ( comment.getAttribute( "data-bys-checkedForLinks" ) === "true" ) return // dont check twice

  	const content = comment.innerHTML
  	const links = content.match( linkRegex )

    comment.setAttribute( "data-bys-checkedForLinks", "true" )
    
    if ( links === null ) return
    
    links.map( link => {
			let href = link
  	
      // link will need prefix if it doesnt already have one
      if ( content.match( prefixRegex ) === null )
      {
        href = "http://" + link.slice(0)
      }
      
      comment.innerHTML = content.replace( link, `<a class="betterYT--comment-link" href="${href}" target="_blank">${link}</a>` )
		} )
  
  })
  
}