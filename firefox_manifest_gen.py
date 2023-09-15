import subprocess

FILES_TO_WATCH = "ts,tsx,scss"

def main():
  try:
    subprocess.check_call( f"nodemon -e {FILES_TO_WATCH} --exec python3 firefox_nodemon.py", shell=True )
  except:
    print( "An error occured with the nodemon command." ) 

main()