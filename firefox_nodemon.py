import subprocess

RELATIVE_PATH_TO_MANIFEST  = "./dist/manifest.json"
# RELATIVE_PATH_TO_FIREFOX_MANIFEST = "./dist/firefox_manifest.json" # doesnt seem to like it not being called manifest.json

REPLACED_LINES = {
  "service_worker": '\t\t"scripts": ["service-worker-loader.js"],',
}

def create_firefox_manifest():
  with open( RELATIVE_PATH_TO_MANIFEST, "r" ) as chrome_manifest:
    lines     = [line.rstrip() for line in chrome_manifest]
    new_lines = []
    
    for line in lines:
      for key in REPLACED_LINES.keys():
        if key in line:
          line = REPLACED_LINES.get( key )
      
        new_lines.append( line + "\n" ) 
  
  with open( RELATIVE_PATH_TO_MANIFEST, "w" ) as firefox_manifest:
    firefox_manifest.writelines( new_lines )    
        

def main():
  process = subprocess.Popen( f"npm run build", shell=True )
  process.wait()
  create_firefox_manifest()
  
main()