import os, psycopg2
url = os.getenv("SUPABASE_DB_URL", "postgresql://postgres:king888@KING888@db.qhgdymgxcbyhtxezvoqt.supabase.co:5432/postgres")
print(f"🔗 連接 Supabase: {url.split('@')[1]}")
try:
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"✅ Supabase 連接成功!\n📊 版本: {version[:60]}...")
    cur.close()
    conn.close()
except Exception as e:
    print(f"❌ 連接失敗: {e}")
