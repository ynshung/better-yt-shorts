/**
 * main.tsx
 * 
 * This is where the react code is injected.
 * For content-script code (that which is injected onto the page),
 * see  ./content.ts
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './components/Popup'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
