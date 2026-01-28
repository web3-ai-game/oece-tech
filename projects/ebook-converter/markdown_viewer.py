import os
import markdown
from flask import Flask, render_template_string, send_from_directory, abort

app = Flask(__name__)
BASE_DIR = "/home/sms/ebook-converter/data/markdown-output"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Ebook Markdown Viewer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .breadcrumb { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .breadcrumb a { text-decoration: none; color: #0066cc; }
        .file-list { list-style: none; padding: 0; }
        .file-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .file-list a { text-decoration: none; color: #0066cc; display: block; }
        .file-list a:hover { text-decoration: underline; }
        .icon { margin-right: 10px; color: #666; }
        .markdown-body { box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 40px; border-radius: 8px; background: #fff; }
        pre { background: #f6f8fa; padding: 16px; overflow: auto; border-radius: 6px; }
        code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="/">🏠 Home</a>
            {% for part in parts %}
                / <a href="/browse/{{ part.path }}">{{ part.name }}</a>
            {% endfor %}
        </div>

        {% if is_file %}
            <div class="markdown-body">
                {{ content | safe }}
            </div>
        {% else %}
            <h1>Directory: {{ current_path or 'Root' }}</h1>
            <ul class="file-list">
                {% if current_path %}
                <li><span class="icon">📁</span><a href="/browse/{{ parent_path }}">.. (Parent Directory)</a></li>
                {% endif %}
                
                {% for item in items %}
                <li>
                    <span class="icon">{{ '📄' if item.is_file else '📁' }}</span>
                    <a href="/browse/{{ item.path }}">{{ item.name }}</a>
                </li>
                {% endfor %}
            </ul>
        {% endif %}
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    return browse('')

@app.route('/browse/', defaults={'req_path': ''})
@app.route('/browse/<path:req_path>')
def browse(req_path):
    abs_path = os.path.join(BASE_DIR, req_path)
    
    # Security check
    if not os.path.realpath(abs_path).startswith(os.path.realpath(BASE_DIR)):
        return abort(403)
    
    if not os.path.exists(abs_path):
        return abort(404)

    # Breadcrumb logic
    parts = []
    if req_path:
        acc = ""
        for p in req_path.split('/'):
            if p:
                acc = os.path.join(acc, p) if acc else p
                parts.append({'name': p, 'path': acc})

    if os.path.isfile(abs_path):
        if abs_path.endswith('.md'):
            with open(abs_path, 'r', encoding='utf-8', errors='replace') as f:
                text = f.read()
            html = markdown.markdown(text, extensions=['fenced_code', 'tables'])
            return render_template_string(HTML_TEMPLATE, is_file=True, content=html, parts=parts, current_path=req_path)
        else:
            return send_from_directory(os.path.dirname(abs_path), os.path.basename(abs_path))
    
    # Directory listing
    items = []
    try:
        for entry in sorted(os.scandir(abs_path), key=lambda e: (e.is_file(), e.name.lower())):
            rel_path = os.path.join(req_path, entry.name) if req_path else entry.name
            items.append({
                'name': entry.name,
                'path': rel_path,
                'is_file': entry.is_file()
            })
    except PermissionError:
        abort(403)
        
    parent_path = os.path.dirname(req_path)
    return render_template_string(HTML_TEMPLATE, 
                                is_file=False, 
                                items=items, 
                                parts=parts, 
                                current_path=req_path, 
                                parent_path=parent_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
