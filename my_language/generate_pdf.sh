#!/bin/bash

# Convert Markdown to HTML with styling
cat > /tmp/gravox_doc.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #95a5a6; padding-bottom: 8px; }
        h3 { color: #7f8c8d; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Monaco', 'Courier New', monospace; }
        pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
        pre code { background: none; color: #ecf0f1; }
        .diagram { background: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
    </style>
</head>
<body>
EOF

# Append the markdown content (converted to HTML)
cat "$1" >> /tmp/gravox_doc.html

cat >> /tmp/gravox_doc.html << 'EOF'
</body>
</html>
EOF

echo "HTML file created at /tmp/gravox_doc.html"
echo "Opening in browser for PDF export..."
open /tmp/gravox_doc.html
