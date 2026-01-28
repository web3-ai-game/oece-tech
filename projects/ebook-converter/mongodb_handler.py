import pymongo
from pymongo.errors import ConnectionFailure, OperationFailure
import logging
from typing import Dict, List, Any
from datetime import datetime
from config import MONGO_URI, MONGO_DB_NAME

logger = logging.getLogger(__name__)

class MongoDBHandler:
    def __init__(self, uri: str = MONGO_URI, db_name: str = MONGO_DB_NAME):
        self.uri = uri
        self.db_name = db_name
        self.client = None
        self.db = None
        self.enabled = False
        self._connect()

    def _connect(self):
        try:
            self.client = pymongo.MongoClient(self.uri, serverSelectionTimeoutMS=5000)
            # Verify connection
            self.client.admin.command('ismaster')
            self.db = self.client[self.db_name]
            self.enabled = True
            
            # Create indexes if they don't exist
            self._create_indexes()
            
            logger.info(f"MongoDB connected successfully to {self.db_name}")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            self.enabled = False

    def _create_indexes(self):
        if not self.enabled:
            return
            
        try:
            # Documents collection - store book metadata and markdown content
            self.db.documents.create_index("filename", unique=True)
            self.db.documents.create_index("processed_at")
            
            # Index structures collection - store Wittgenstein structures
            self.db.structures.create_index("doc_id")
            self.db.structures.create_index("concepts.name")
            
            # Vectors/Embeddings collection (placeholder for future vector search)
            self.db.vectors.create_index("doc_id")
            
            logger.info("MongoDB indexes verified/created")
        except Exception as e:
            logger.warning(f"Failed to create MongoDB indexes: {e}")

    def save_document(self, filename: str, content: str, metadata: Dict[str, Any]) -> str:
        """Save the converted markdown document and metadata"""
        if not self.enabled:
            return None

        try:
            doc = {
                "filename": filename,
                "content_snippet": content[:1000] if content else "", # Only save first 1000 chars
                # "content": content, # REMOVED to save space (Quota exceeded)
                "metadata": metadata,
                "processed_at": datetime.utcnow(),
                "status": "completed"
            }
            
            # Upsert based on filename
            result = self.db.documents.update_one(
                {"filename": filename},
                {"$set": doc},
                upsert=True
            )
            
            doc_id = str(result.upserted_id) if result.upserted_id else str(self.db.documents.find_one({"filename": filename})["_id"])
            logger.info(f"Saved document to MongoDB: {filename} (ID: {doc_id})")
            return doc_id
        except Exception as e:
            logger.error(f"Failed to save document to MongoDB: {e}")
            return None

    def save_structure(self, doc_id: str, structure: Dict[str, Any]):
        """Save the Wittgenstein structure (index)"""
        if not self.enabled or not doc_id:
            return

        try:
            record = {
                "doc_id": doc_id,
                "structure": structure,
                "created_at": datetime.utcnow()
            }
            
            self.db.structures.update_one(
                {"doc_id": doc_id},
                {"$set": record},
                upsert=True
            )
            logger.info(f"Saved structure index to MongoDB for doc_id: {doc_id}")
        except Exception as e:
            logger.error(f"Failed to save structure to MongoDB: {e}")

    def document_exists(self, filename: str) -> bool:
        """Check if document already exists"""
        if not self.enabled:
            return False
        return self.db.documents.count_documents({"filename": filename}, limit=1) > 0
