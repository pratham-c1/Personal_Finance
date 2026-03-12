import mysql.connector
from mysql.connector import pooling
from config import Config
import logging

logger = logging.getLogger(__name__)

connection_pool = None

def init_pool():
    global connection_pool
    try:
        connection_pool = pooling.MySQLConnectionPool(
            pool_name="pf_pool",
            pool_size=10,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            autocommit=True,
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        logger.info("Database pool initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Database pool init failed: {e}")
        return False

def get_connection():
    global connection_pool
    if not connection_pool:
        init_pool()
    return connection_pool.get_connection()

def execute_query(query, params=None, fetch=True):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or ())
        if fetch:
            result = cursor.fetchall()
            return result
        else:
            conn.commit()
            return cursor.lastrowid
    except Exception as e:
        logger.error(f"Query error: {e}\nQuery: {query}\nParams: {params}")
        raise e
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def execute_one(query, params=None):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params or ())
        result = cursor.fetchone()
        return result
    except Exception as e:
        logger.error(f"Query error: {e}")
        raise e
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
