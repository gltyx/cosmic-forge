import time
import os
import subprocess

# Configuration
file_to_watch = './resources/techData.json'
script_to_run = 'graph.py'
check_interval = 1

# Initial last modified time
last_modified_time = None

def get_file_mod_time(file_path):
    try:
        return os.path.getmtime(file_path)
    except FileNotFoundError:
        return None

# Monitoring loop
print(f"Monitoring '{file_to_watch}' for changes...")
while True:
    current_modified_time = get_file_mod_time(file_to_watch)
    
    if current_modified_time != last_modified_time:
        last_modified_time = current_modified_time
        print(f"File '{file_to_watch}' has changed. Running '{script_to_run}'...")
        subprocess.run(['python', script_to_run])
    else:
        print("Monitoring for changes... No updates yet.")
    
    time.sleep(check_interval)  # Wait before checking again
