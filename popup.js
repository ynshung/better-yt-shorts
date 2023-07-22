const browserObj = (typeof browser === 'undefined') ? chrome : browser;
const version = browserObj.runtime.getManifest().version;
document.getElementById('version').textContent = version;

const modal = document.getElementById("edit-modal");
const resetBtn = document.querySelector(".reset-btn");
const editBtnList = document.querySelectorAll(".edit-btn");
const closeBtn = document.querySelector(".close-btn");
const keybindInput = document.getElementById("keybind-input");
const keybindTable = document.getElementById( "keybind-table" )

let modalTitleSpan = document.getElementById("modal-title-span");
let invalidKeybinds = [
  'Backspace',
  'Enter',
  'NumpadEnter',
  'Escape',
  'Tab',
  'Space',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'F13',             // printscreen
  'MetaLeft',        // windows/command
  'MetaRight',

  'ControlLeft',
  'ControlRight',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
];

const defaultKeybinds = {
  'Seek Backward':   'ArrowLeft',
  'Seek Forward':    'ArrowRight',
  'Decrease Speed':  'KeyU',
  'Reset Speed':     'KeyI',
  'Increase Speed':  'KeyO',
  'Decrease Volume': 'Minus',
  'Increase Volume': 'Equal',
  'Toggle Mute':     'KeyM',
  'Next Frame':      'Comma',
  'Previous Frame':  'Period',
  'Next Short': 'KeyS', 
  'Previous Short': 'KeyW',
};
const defaultExtraOptions = {
  skip_enabled:   false,
  skip_threshold: 500,
}

// this is so that the bindings are always generated in the right order
const bindsOrder = [
  'Seek Backward',
  'Seek Forward',
  'Decrease Speed',
  'Reset Speed',
  'Increase Speed',
  'Decrease Volume',
  'Increase Volume',
  'Toggle Mute',
  'Next Frame',
  'Previous Frame',
  'Next Short',
  'Previous Short',
]

let currentKeybinds = Object.assign({}, defaultKeybinds);
let currentExtraOpts = Object.assign({}, defaultExtraOptions);
let currentKeybindArray = [];
let keybindState = '';

// Set user's prefers-color-scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', "dark");
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    document.documentElement.setAttribute('data-theme', newColorScheme);
});

// Get keybinds from storage
browserObj.storage.local.get(['keybinds'])
.then((result) => {
    let updatedkeybinds = result['keybinds'];
    if (updatedkeybinds) {
        // Set default keybinds if not exists
        for (const [cmd, keybind] of Object.entries(defaultKeybinds)) {
          if (!result.keybinds[cmd]) result.keybinds[cmd] = keybind;
        }
        
        populateKeybindsTable( updatedkeybinds )
        currentKeybinds = updatedkeybinds;
    }
    // Keybind array for easier checking if keybind is already in use
    currentKeybindArray = Object.values(currentKeybinds);
});

// Get extra options from storage
browserObj.storage.local.get(['extraopts'])
  .then((result) => {
      let updatedExtraOpts = result['extraopts'];
      if ( updatedExtraOpts ) {
        // Set default extraopts if not exists
        for (const [ option, value ] of Object.entries( defaultExtraOptions )) {
          if (result.extraopts[ option ]) continue

          result.extraopts[ option ] = value;
        }
      }
        
      // set skip toggle
      document.getElementById( "extra_options_skip_enabled" ).checked = result.extraopts.skip_enabled

      // set skip threshold
      document.getElementById( "extra_options_skip_threshold" ).value = result.extraopts.skip_threshold
  })

// Open modal
for (let i = 0; i < editBtnList.length; i++) {
    editBtnList[i].onclick = function() {
        modal.style.display = "block";
        keybindInput.focus();
        keybindInput.select();
        modalTitleSpan.textContent = this.id;
        keybindState = this.id;
    }
}

resetBtn.onclick = () => {
  currentKeybinds     = Object.assign( {},  defaultKeybinds );
  currentKeybindArray = Object.values(currentKeybinds);
  
  populateKeybindsTable( defaultKeybinds )

  browserObj.storage.local.set({ 'keybinds' : defaultKeybinds });
}

// Close modal (x)
closeBtn.onclick = () => {
    modal.style.display = "none";
}
// Close modal (click outside)
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

keybindInput.addEventListener('keydown', (event) => {
    event.preventDefault();
    var keybind    = event.code;
    var keybindAlt = event.key;   // for legacy, will become obsolete

    console.log( `[BYS] :: Attempting to set key: ${keybind}` )

    if ( invalidKeybinds.includes(keybind) ) {
      keybindInput.value = "";
      closeBtn.click();
      alert("Invalid keybind: <<" + keybind + ">> is not allowed.");
      return;
    }
    if ( currentKeybindArray.includes( keybind ) || currentKeybindArray.includes( keybindAlt ) ) {
      keybindInput.value = "";
      closeBtn.click();
      alert("Invalid keybind: <<" + keybind + ">> is already in use.");
      return;
    }

    // document.getElementById(keybindState+'-span').textContent = keybind;
    currentKeybinds[keybindState] = keybind;
    currentKeybindArray = Object.values(currentKeybinds);

    browserObj.storage.local.set({ 'keybinds' : currentKeybinds })
    .then(() => {
        keybindInput.value = "";
        closeBtn.click(); 
    });

    populateKeybindsTable( currentKeybinds )
});

document.getElementById( "extra_options_skip_enabled" ).addEventListener( "change", e => {
  browserObj.storage.local.get(['extraopts']).then( result => {
    currentExtraOpts = result.extraopts;
    currentExtraOpts.skip_enabled = e.target.checked;
    browserObj.storage.local.set({ 'extraopts' : currentExtraOpts });
  });
});

document.getElementById( "extra_options_skip_threshold" ).addEventListener( "input", e => {
  browserObj.storage.local.get(['extraopts']).then( result => {
    currentExtraOpts = result.extraopts
    currentExtraOpts.skip_threshold = e.target.valueAsNumber;
    browserObj.storage.local.set({ 'extraopts' : currentExtraOpts });
  });
});

const EDIT_BUTTON_SVG_STRING = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px">
  <g id="pencil-svg" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      d="M21.707,5.565,18.435,2.293a1,1,0,0,0-1.414,0L3.93,15.384a.991.991,0,0,0-.242.39l-1.636,4.91A1,1,0,0,0,3,22a.987.987,0,0,0,.316-.052l4.91-1.636a.991.991,0,0,0,.39-.242L21.707,6.979A1,1,0,0,0,21.707,5.565ZM7.369,18.489l-2.788.93.93-2.788,8.943-8.944,1.859,1.859ZM17.728,8.132l-1.86-1.86,1.86-1.858,1.858,1.858Z">
    </path>
  </g>
</svg>
`

function populateKeybindsTable( keybinds )
{
  keybindTable.innerHTML = `
  <tr class="prevent-selection">
    <th>Command</th>
    <th>Key</th>
    <th></th>
  </tr>`

  for ( const command of bindsOrder )
  {
    const bind = keybinds[ command ]
    const row = generateKeybindItem( command, bind )
    
    if ( row === null ) continue

    keybindTable.appendChild( row )    
  }
}

/**
 * Creates a table row for the keybinds table.
 * @param {string} command 
 * @param {string} bind 
 * @returns Table Row Element
 */
function generateKeybindItem( command, bind )
{
  const tr = document.createElement( "tr" )
  
  // The command name
  const td1 = document.createElement( "td" )
  td1.innerHTML = command

  // the key that is bound
  const td2 = document.createElement( "td" )
  td2.innerHTML = `
  <div class="keybind-wrapper">
    <span id="${command}-span" class="keybind-span">${bind}</span>
  </div>
  `

  // the rebind icon
  const td3 = document.createElement( "td" )
  td3.innerHTML = `
  <button id="${command}" class="edit-btn">
    ${ EDIT_BUTTON_SVG_STRING }
  </button>
  `
  td3.querySelector( `[id="${command}"]` ).addEventListener( "click", e => {
    modal.style.display = "block";

    keybindInput.focus();
    keybindInput.select();

    modalTitleSpan.innerText = command;
    keybindState             = command;

  } )

  tr.appendChild( td1 )
  tr.appendChild( td2 )
  tr.appendChild( td3 )

  return tr
}
