import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_URL = os.environ.get("DATABASE_URL")

def init_schema():
    if not DB_URL:
        print("DATABASE_URL is not set in environment or env files!")
        return
        
    print(f"Connecting to database to initialize schema...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        print("Reading schema.sql...")
        with open("schema.sql", "r", encoding="utf-8") as f:
            schema_sql = f.read()
            
        print("Executing schema SQL...")
        cur.execute(schema_sql)
        conn.commit()
        
        cur.close()
        conn.close()
        print("Database schema initialized successfully!")
    except Exception as e:
        print("Error initializing schema:", e)

if __name__ == "__main__":
    init_schema()
