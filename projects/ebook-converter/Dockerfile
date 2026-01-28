FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
# Manually installing packages since requirements.txt might not be fully up to date in the context
RUN pip install --no-cache-dir google-generativeai rich pymongo boto3 requests beautifulsoup4

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p /app/data/pipeline-cache \
    /app/data/markdown-output \
    /app/data/wittgenstein-index

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run the visual processor
CMD ["python3", "visual_processor.py", "-n", "1000", "-w", "50"]
