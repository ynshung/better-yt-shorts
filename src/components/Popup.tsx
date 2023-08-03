import "../css/popup.css"
import bys_logo from "../assets/icons/bys-48.png"
import { VERSION } from "../lib/declarations"

// todo  - split this into its component parts

function Popup() {
  return (
    <>
      <div>
        <div className="container" data-theme="light">
          <div className="title-container">
            <div>
              <div className="title">Better Youtube Shorts</div>
              <div className="version">v<span id="version"/>{VERSION}</div>
            </div>
            <img src={bys_logo} alt="logo" height="30px" width="auto" />
          </div>
          <div className="separation-line" style={{marginTop: 5, opacity: '0.9'}} />
          <h3 className="prevent-selection" style={{textAlign: 'center', margin: '5px 0px'}}>Keybinds</h3>
          <table style={{width: '100%'}} data-theme="light" id="keybind-table">
          </table>
          <h3 className="prevent-selection" style={{textAlign: 'center', margin: '5px 0px'}}>Extra Options</h3>
          <div id="extra_options">
            <div className="extra_options--row">
              <label htmlFor="skip-bad-shorts">Automatically skip shorts with fewer likes?</label>
              <input type="checkbox" id="extra_options_skip_enabled" name="skip-bad-shorts" />
            </div>
            <div className="extra_options--row">
              <label htmlFor="skip-bad-shorts">Skip shorts with fewer than this many likes:</label>
              <input type="number" id="extra_options_skip_threshold" name="skip-bad-shorts-threshold" min={0} />
            </div>
          </div>
          <div className="footer prevent-selection">Reload the page for changes to take effect.</div>
          <div className="btn-wrapper"><span className="btn reset-btn">Reset keybinds</span><a href="https://github.com/ynshung/better-yt-shorts" target="_blank"><span className="btn">GitHub</span></a></div>
          {/* Modal */}
          <div id="edit-modal" className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <div>Edit keybind: <span className="modal-title" id="modal-title-span" /></div>
                <span className="close-btn">×</span>
              </div>
              <div className="separation-line" style={{opacity: '0.5'}} />
              <div className="input-wrapper">
                <label htmlFor="keybind-input" className="prevent-selection">Press desired key</label>
                <input type="text" id="keybind-input" />
                <div className="prevent-selection" style={{opacity: '0.8', fontSize: 10}}>Does not support key combinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Popup
