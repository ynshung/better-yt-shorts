import subprocess

FILES_TO_WATCH = "ts,tsx,scss"

RELATIVE_PATH_TO_CHROME_MANIFEST  = "./dist/manifest.json"
RELATIVE_PATH_TO_FIREFOX_MANIFEST = "./dist/firefox_manifest.json"

REPLACED_LINES = {
  "service_worker": '\t\t"scripts": ["service-worker-loader.js"]',
}

def create_firefox_manifest():
  with open( RELATIVE_PATH_TO_FIREFOX_MANIFEST, "w" ) as firefox_manifest:
    
    with open( RELATIVE_PATH_TO_CHROME_MANIFEST, "r" ) as chrome_manifest:

      lines = [line.rstrip() for line in chrome_manifest]
      
      for line in lines:
        for key in REPLACED_LINES.keys():
          if key in line:
            line = REPLACED_LINES.get( key )
        
        firefox_manifest.write( line + "\n" )    
        

def main():
  create_firefox_manifest()
  try:
    subprocess.check_call( f"nodemon -e {FILES_TO_WATCH} --exec npm run build", shell=True )
  except:
    print( "An error occured with the nodemon command." ) 


main()