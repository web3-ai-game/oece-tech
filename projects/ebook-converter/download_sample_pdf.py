from multi_cloud_downloader import MultiCloudDownloader
import logging

logging.basicConfig(level=logging.INFO)

def download_sample():
    downloader = MultiCloudDownloader(cache_dir="/home/sms/ebook-converter/data/pdf-sample-cache")
    
    file_info = {
        'source': 'baidu',
        'path': '/知識庫/古籍县志电子版/各地方志/北京天津河北',
        'name': '无极县教育志.pdf',
        'size': 18331175
    }
    
    print(f"Downloading sample: {file_info['name']}...")
    local_path = downloader.download_file(file_info)
    
    if local_path:
        print(f"Success: {local_path}")
    else:
        print("Failed to download")

if __name__ == "__main__":
    download_sample()
