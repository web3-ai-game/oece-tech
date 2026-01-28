#!/usr/bin/env python3
import os
import sys
import logging
from pathlib import Path
from main import EbookConverterPipeline
from config import MONGO_URI, MONGO_DB_NAME
from mongodb_handler import MongoDBHandler

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TestFullStack")

def test_full_stack():
    logger.info("=== Starting Full Stack Test ===")
    
    # 1. Create a dummy test file
    test_file_path = "/tmp/test_book_xai.txt"
    with open(test_file_path, "w", encoding="utf-8") as f:
        f.write("Title: The Philosophy of Testing\n\nChapter 1: The Beginning\n\nTesting is the essence of verification. Without verification, there is only assumption.")
    
    logger.info(f"Created test file: {test_file_path}")
    
    # 1.5. Clean up existing test data in MongoDB
    logger.info("Cleaning up existing test data in MongoDB...")
    mongo = MongoDBHandler()
    filename = "test_book_xai.txt"
    if mongo.enabled:
        try:
            mongo.db.documents.delete_many({"filename": filename})
            # Also delete structure
            # We don't have doc_id easily here without querying, but that's fine for now as specific doc cleanup
            # Ideally we should clean up structures too, but it won't block re-insertion of document.
            logger.info(f"Deleted {filename} from MongoDB documents")
        except Exception as e:
            logger.warning(f"Failed to clean up MongoDB: {e}")

    # 2. Initialize Pipeline
    try:
        pipeline = EbookConverterPipeline()
    except Exception as e:
        logger.error(f"Failed to initialize pipeline: {e}")
        return False

    # 3. Process the file
    logger.info("Processing file...")
    result = pipeline.process_single_file(test_file_path)
    
    if not result.get('success'):
        logger.error(f"Processing failed: {result.get('error')}")
        return False
        
    if result.get('skipped'):
        logger.info("Test file was skipped (already exists). This is fine, but deleting from Mongo to retry would be better for a real test.")
        # Optional: cleanup and retry
        
    logger.info(f"Processing result: {result}")
    
    # 4. Verify MongoDB
    logger.info("Verifying MongoDB...")
    mongo = MongoDBHandler()
    filename = "test_book_xai.txt"
    
    if mongo.document_exists(filename):
        logger.info("✅ Document found in MongoDB")
    else:
        logger.error("❌ Document NOT found in MongoDB")
        return False
        
    # 5. Verify Local Output
    md_path = result.get('markdown_path')
    if md_path and os.path.exists(md_path):
        logger.info(f"✅ Markdown file exists: {md_path}")
        # Check content to see if X.AI/Gemini actually worked (look for Markdown headers)
        with open(md_path, 'r') as f:
            content = f.read()
            if "#" in content:
                logger.info("✅ Markdown formatting detected")
            else:
                logger.warning("⚠️ Markdown formatting NOT detected (Fallback might have failed)")
    else:
        logger.error("❌ Markdown file missing")
        return False

    logger.info("=== Test Passed Successfully ===")
    return True

if __name__ == "__main__":
    test_full_stack()
