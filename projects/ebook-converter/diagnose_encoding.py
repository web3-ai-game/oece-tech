import chardet
import sys

file_path = "/home/sms/ebook-converter/data/pipeline-cache/_快穿之完美命运_by西子绪.txt"

print(f"Checking {file_path}...")
try:
    with open(file_path, 'rb') as f:
        raw = f.read(10000) # Read first 10KB
        result = chardet.detect(raw)
        print(f"Detected encoding: {result}")
        
    with open(file_path, 'rb') as f:
        head = f.read(20)
        print(f"Head bytes: {head}")
except Exception as e:
    print(f"Error: {e}")
