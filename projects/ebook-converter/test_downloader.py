import unittest
from unittest.mock import MagicMock, patch
import os
import sys
from pathlib import Path

# Add current directory to path so we can import modules
sys.path.append(os.getcwd())

from multi_cloud_downloader import MultiCloudDownloader

class TestMultiCloudDownloader(unittest.TestCase):
    def setUp(self):
        self.downloader = MultiCloudDownloader(cache_dir="/tmp/test_cache")
        
    @patch('subprocess.run')
    def test_list_baidu_files(self, mock_run):
        # Mock subprocess output for bypy list
        mock_result = MagicMock()
        mock_result.stdout = "F file1.txt 1000 2023-01-01\nD dir1 0 2023-01-01"
        mock_run.return_value = mock_result
        
        files = self.downloader.list_baidu_files("/apps/bypy")
        
        # Verify subprocess call
        mock_run.assert_called_with(
            ["bypy", "list", "/apps/bypy"],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Verify parsing (Note: the mock output above assumes the parser handles split() correctly)
        # The parser logic is: 
        # for line in result.stdout.split('\n'):
        #    if any(ext in line.lower() for ext in self.ebook_formats):
        #       parts = line.split()
        #       files.append(...)
        
        # Let's provide a better mock output that matches expected format logic
        # MultiCloudDownloader.list_baidu_files logic:
        # parts = line.split()
        # file_type = parts[0], filename = parts[1], size = parts[2]
        
        mock_result.stdout = "F book.txt 1024 2023-01-01 /apps/bypy/book.txt"
        mock_run.return_value = mock_result
        
        files = self.downloader.list_baidu_files("/apps/bypy")
        self.assertEqual(len(files), 1)
        self.assertEqual(files[0]['name'], 'book.txt')
        self.assertEqual(files[0]['source'], 'baidu')
        self.assertEqual(files[0]['size'], 1024)

    @patch('subprocess.run')
    def test_download_baidu(self, mock_run):
        mock_run.return_value = MagicMock(returncode=0)
        
        file_info = {
            'source': 'baidu',
            'path': '/apps/bypy',
            'name': 'book.txt'
        }
        
        # We assume local path creation is mocked or we just check the call
        # Since download_file checks for local_path.exists(), we might need to mock Path.exists
        # But download_file relies on subprocess to actually creating the file.
        # For this test, we can mock Path to always return True for exists? 
        # Or simpler, just check if subprocess is called with correct args.
        
        with patch('pathlib.Path.exists') as mock_exists:
            # First exists check (cache hit) -> False
            # Second exists check (after download) -> True
            mock_exists.side_effect = [False, True]
            
            result = self.downloader.download_file(file_info)
            
            self.assertTrue(result)
            mock_run.assert_called()
            args, kwargs = mock_run.call_args
            self.assertEqual(args[0][0], 'bypy')
            self.assertEqual(args[0][1], 'downfile')

    @patch('subprocess.run')
    def test_download_gdrive(self, mock_run):
        mock_run.return_value = MagicMock(returncode=0)
        
        file_info = {
            'source': 'gdrive',
            'path': 'books/book.pdf',
            'name': 'book.pdf'
        }
        
        with patch('pathlib.Path.exists') as mock_exists:
            mock_exists.side_effect = [False, True]
            
            result = self.downloader.download_file(file_info)
            
            self.assertTrue(result)
            mock_run.assert_called()
            args, kwargs = mock_run.call_args
            self.assertEqual(args[0][0], 'rclone')
            self.assertEqual(args[0][1], 'copy')

if __name__ == '__main__':
    unittest.main()
