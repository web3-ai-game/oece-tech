#!/usr/bin/env python3
import os
import json
import logging
from pathlib import Path
from typing import Dict, Optional
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
from config import S3_BUCKET, S3_REGION, S3_ENDPOINT_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class S3Uploader:
    def __init__(self, bucket_name: str = S3_BUCKET):
        self.bucket_name = bucket_name
        self.enabled = False
        try:
            # 配置 S3 客戶端 (支援 GCS)
            self.s3_client = boto3.client(
                's3',
                region_name=S3_REGION,
                endpoint_url=S3_ENDPOINT_URL,
                config=Config(
                    signature_version='s3',
                    s3={'addressing_style': 'path'}
                )
            )
            # 測試憑證
            self.s3_client.list_buckets()
            self.enabled = True
            logger.info(f"S3 上傳器初始化完成，目標 bucket: {bucket_name}")
        except Exception as e:
            logger.warning(f"S3 憑證未配置或無效，跳過 S3 上傳: {e}")
            self.s3_client = None
    
    def upload_file(self, local_path: str, s3_key: str, metadata: Optional[Dict] = None) -> bool:
        """上傳文件到 S3"""
        if not self.enabled:
            return True  # S3 未啟用，視為成功
        
        try:
            extra_args = {}
            if metadata:
                # S3 metadata must be ASCII. URL encode values to handle non-ASCII (e.g. Chinese paths)
                import urllib.parse
                encoded_metadata = {}
                for k, v in metadata.items():
                    try:
                        encoded_metadata[k] = urllib.parse.quote(str(v))
                    except Exception:
                        encoded_metadata[k] = str(v) # Fallback, might fail if not ASCII
                
                extra_args['Metadata'] = encoded_metadata
            
            self.s3_client.upload_file(
                local_path,
                self.bucket_name,
                s3_key,
                ExtraArgs=extra_args
            )
            
            logger.info(f"上傳成功: {s3_key}")
            return True
            
        except ClientError as e:
            if metadata and "SignatureDoesNotMatch" in str(e) or "InvalidRequest" in str(e):
                logger.warning(f"上傳失敗 (Metadata 簽名/編碼問題)，嘗試不帶 Metadata 重試: {s3_key}")
                try:
                    self.s3_client.upload_file(
                        local_path,
                        self.bucket_name,
                        s3_key
                    )
                    logger.info(f"重試上傳成功 (無 Metadata): {s3_key}")
                    return True
                except ClientError as retry_e:
                    logger.error(f"重試上傳失敗 {s3_key}: {retry_e}")
                    return False
            
            logger.error(f"上傳失敗 {s3_key}: {e}")
            return False
    
    def upload_markdown(self, md_path: str, doc_id: str) -> bool:
        """上傳 Markdown 文件"""
        s3_key = f"markdown/{doc_id}/{Path(md_path).name}"
        return self.upload_file(md_path, s3_key, {'type': 'markdown', 'doc_id': doc_id})
    
    def upload_index(self, index_data: Dict, index_type: str) -> bool:
        """上傳索引數據"""
        if not self.enabled:
            return True  # S3 未啟用，視為成功
        
        try:
            s3_key = f"index/{index_type}.json"
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=json.dumps(index_data, ensure_ascii=False, indent=2).encode('utf-8'),
                ContentType='application/json',
                Metadata={'type': 'index', 'index_type': index_type}
            )
            
            logger.info(f"索引上傳成功: {s3_key}")
            return True
            
        except ClientError as e:
            logger.error(f"索引上傳失敗: {e}")
            return False
    
    def upload_structure(self, doc_id: str, structure: Dict) -> bool:
        """上傳文檔結構"""
        try:
            s3_key = f"structures/{doc_id}/structure.json"
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=json.dumps(structure, ensure_ascii=False, indent=2).encode('utf-8'),
                ContentType='application/json',
                Metadata={'type': 'structure', 'doc_id': doc_id}
            )
            
            logger.info(f"結構上傳成功: {s3_key}")
            return True
            
        except ClientError as e:
            logger.error(f"結構上傳失敗: {e}")
            return False
    
    def create_folder_structure(self):
        """創建 S3 文件夾結構"""
        if not self.enabled:
            return

        folders = ['markdown/', 'index/', 'structures/', 'originals/']
        
        for folder in folders:
            try:
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=folder,
                    Body=b''
                )
                logger.info(f"創建文件夾: {folder}")
            except ClientError as e:
                logger.error(f"創建文件夾失敗 {folder}: {e}")
    
    def list_files(self, prefix: str = '') -> list:
        """列出 S3 文件"""
        if not self.enabled:
            return []

        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            if 'Contents' in response:
                return [obj['Key'] for obj in response['Contents']]
            return []
            
        except ClientError as e:
            logger.error(f"列出文件失敗: {e}")
            return []

if __name__ == "__main__":
    uploader = S3Uploader()
    print("S3 上傳器初始化完成")
    uploader.create_folder_structure()
