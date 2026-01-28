#!/usr/bin/env python3
"""Gemini Router API 服務 - FastAPI + Redis 會話記憶"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import redis, json, time, os, google.generativeai as genai
from gemini_key_pool import get_key_pool, ModelTier
from typing import Optional, List, Dict

app = FastAPI(title="Gemini Key Pool Router")
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379"), decode_responses=True)
pool = get_key_pool()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    model_tier: str = "flash-lite"
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    model_used: str
    key_used: str
    session_id: str

@app.get("/health")
def health(): return {"status": "healthy", "timestamp": int(time.time())}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    tier = ModelTier.FLASH_LITE if req.model_tier == "flash-lite" else (ModelTier.PRO if req.model_tier == "pro" else ModelTier.FLASH)
    key, key_name = pool.get_key(tier)
    if not key: raise HTTPException(429, "所有 Keys 已達限流")
    
    session_id = req.session_id or f"{req.user_id}_{int(time.time())}"
    history_key = f"conversation:{req.user_id}:{session_id}"
    history_data = redis_client.get(history_key)
    history = json.loads(history_data) if history_data else []
    
    genai.configure(api_key=key)
    model = genai.GenerativeModel(tier.value)
    prompt = "\n".join([f"{m['role']}: {m['content']}" for m in history[-5:]]) + f"\nuser: {req.message}\nassistant:"
    response = model.generate_content(prompt)
    
    history.extend([{"role": "user", "content": req.message}, {"role": "assistant", "content": response.text}])
    redis_client.setex(history_key, 86400, json.dumps(history))
    pool.record_usage(key_name, len(response.text.split()))
    
    return ChatResponse(response=response.text, model_used=tier.value, key_used=key_name, session_id=session_id)

@app.get("/stats/{key_name}")
def get_stats(key_name: str):
    stats_data = redis_client.get(f"gemini:stats:{key_name}")
    return json.loads(stats_data) if stats_data else {"error": "Key not found"}

@app.get("/sessions/{user_id}")
def list_sessions(user_id: str):
    keys = redis_client.keys(f"conversation:{user_id}:*")
    return [k.split(":")[-1] for k in keys]
