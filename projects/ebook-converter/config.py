import os

# --- AI API Keys ---
# Set these via environment variables or .env file

# X.AI Keys (Priority 1)
XAI_API_KEYS = [
    os.environ.get('XAI_API_KEY_1', ''),
    os.environ.get('XAI_API_KEY_2', '')
]

# Gemini API Keys (Priority 2)
GEMINI_API_KEYS = [
    os.environ.get('GEMINI_API_KEY_1', ''),
    os.environ.get('GEMINI_API_KEY_2', ''),
    os.environ.get('GEMINI_API_KEY_3', ''),
]

GEMINI_API_KEY = GEMINI_API_KEYS[0] if GEMINI_API_KEYS[0] else os.environ.get('GEMINI_API_KEY', '')

# --- Model Configurations ---
XAI_MODEL = "grok-3"
GEMINI_MODELS = {
    'fast': 'gemini-2.5-flash-lite',
    'lite': 'gemini-2.5-flash-lite',
    'default': 'gemini-2.5-flash-lite'
}

# --- Database Configuration ---
MONGO_URI = os.environ.get('MONGODB_URI', '')
MONGO_DB_NAME = "ebook_knowledge_base"

# --- Storage Configuration ---
BAIDU_CACHE_DIR = os.environ.get('BAIDU_CACHE_DIR', './data/baidu-cache')
MD_OUTPUT_DIR = os.environ.get('MD_OUTPUT_DIR', './data/markdown-output')
INDEX_DIR = os.environ.get('INDEX_DIR', './data/wittgenstein-index')

S3_BUCKET = os.environ.get('S3_BUCKET', 'your-bucket')
S3_REGION = os.environ.get('S3_REGION', 'us-east-1')
S3_ENDPOINT_URL = os.environ.get('S3_ENDPOINT_URL', 'https://storage.googleapis.com')

# --- Performance & Limits ---
MAX_DISK_USAGE_GB = 200
CHUNK_SIZE = 8192
BATCH_SIZE = 10
MAX_WORKERS = 50
API_TIMEOUT = 120

SUPPORTED_FORMATS = [
    '.pdf', '.epub', '.mobi', '.azw', '.azw3',
    '.doc', '.docx', '.txt', '.rtf', '.odt',
    '.djvu', '.fb2', '.html', '.htm'
]

WITTGENSTEIN_STRUCTURE = {
    'propositions': True,
    'concepts': True,
    'relations': True,
    'hierarchy': True
}

ENABLE_LOCAL_INDEX = False
