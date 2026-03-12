import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, send_from_directory, session
from flask_cors import CORS
from config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='../frontend', static_url_path='')
app.secret_key = Config.SECRET_KEY
app.config['SESSION_COOKIE_HTTPONLY'] = True

CORS(app, supports_credentials=True, origins=['http://localhost:5000', 'http://127.0.0.1:5000'])

# Import and register blueprints
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.income import income_bp
from routes.expense import expense_bp
from routes.networth import networth_bp
from routes.loan import loan_bp
from routes.share import share_bp
from routes.bike import bike_bp
from routes.petrol import petrol_bp
from routes.baby import baby_bp
from routes.reports import reports_bp

app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(income_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(networth_bp)
app.register_blueprint(loan_bp)
app.register_blueprint(share_bp)
app.register_blueprint(bike_bp)
app.register_blueprint(petrol_bp)
app.register_blueprint(baby_bp)
app.register_blueprint(reports_bp)

@app.route('/')
@app.route('/login')
def login_page():
    return send_from_directory('../frontend', 'login.html')

@app.route('/dashboard')
def dashboard_page():
    return send_from_directory('../frontend', 'dashboard.html')

@app.route('/<path:page>')
def serve_page(page):
    if not page.startswith('api/') and not page.startswith('css/') and not page.startswith('js/'):
        if not page.endswith('.html'):
            page = page + '.html'
    return send_from_directory('../frontend', page)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Personal Finance System Running'})

if __name__ == '__main__':
    from database import init_pool
    if init_pool():
        logger.info("Database connected successfully")
    else:
        logger.warning("Database connection failed - check MySQL settings")
    
    logger.info(f"Starting server on http://localhost:{Config.PORT}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
