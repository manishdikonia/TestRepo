#!/bin/bash

echo "🎨 Rendering Auth & RBAC System Diagrams..."

# Check if mmdc (Mermaid CLI) is installed
if ! command -v mmdc &> /dev/null; then
    echo "Installing Mermaid CLI..."
    npm install -g @mermaid-js/mermaid-cli
fi

# Render all diagram versions
echo "📊 Rendering Clean Version..."
mmdc -i auth_rbac_clean.mmd -o auth_rbac_clean.png -t dark -b transparent

echo "🏗️ Rendering Structured Version..."
mmdc -i auth_rbac_structured.mmd -o auth_rbac_structured.png -t dark -b transparent

echo "🔗 Rendering ER Diagram..."
mmdc -i auth_rbac_er.mmd -o auth_rbac_er.png -t dark -b transparent

# Create an HTML preview file
cat > preview.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth & RBAC System Diagrams</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: white;
            font-size: 2.5rem;
            margin-bottom: 40px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .diagram-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h2 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .diagram-container {
            text-align: center;
            overflow-x: auto;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .description {
            background: #f7f8fc;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .feature {
            background: #f0f4ff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #d4e0ff;
        }
        .feature h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 1.1rem;
        }
        .feature ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .feature li {
            margin: 5px 0;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Auth & RBAC System Architecture</h1>
        
        <div class="diagram-section">
            <h2>📊 Structured Flow Diagram</h2>
            <div class="description">
                <strong>Overview:</strong> This diagram shows the complete system architecture with clear module separation and data flow relationships.
            </div>
            <div class="features">
                <div class="feature">
                    <h3>🔐 Authentication & RBAC</h3>
                    <ul>
                        <li>Permission management</li>
                        <li>Role-based access control</li>
                        <li>Role-permission mapping</li>
                    </ul>
                </div>
                <div class="feature">
                    <h3>🏢 Organization</h3>
                    <ul>
                        <li>Company management</li>
                        <li>User-company associations</li>
                        <li>Role assignments</li>
                    </ul>
                </div>
                <div class="feature">
                    <h3>📚 Learning Platform</h3>
                    <ul>
                        <li>Batch management</li>
                        <li>Participant enrollment</li>
                        <li>Resource access control</li>
                    </ul>
                </div>
                <div class="feature">
                    <h3>📝 Assessment System</h3>
                    <ul>
                        <li>Assignment creation</li>
                        <li>Submission tracking</li>
                        <li>Assessment management</li>
                    </ul>
                </div>
            </div>
            <div class="diagram-container">
                <img src="auth_rbac_structured.png" alt="Structured Flow Diagram">
            </div>
        </div>
        
        <div class="diagram-section">
            <h2>🔗 Entity Relationship Diagram</h2>
            <div class="description">
                <strong>Database Schema:</strong> Detailed entity relationships showing primary keys, foreign keys, and cardinality between tables.
            </div>
            <div class="diagram-container">
                <img src="auth_rbac_er.png" alt="ER Diagram">
            </div>
        </div>
        
        <div class="diagram-section">
            <h2>📈 Simplified System Flow</h2>
            <div class="description">
                <strong>High-Level View:</strong> A cleaner representation focusing on the main components and their interactions.
            </div>
            <div class="diagram-container">
                <img src="auth_rbac_clean.png" alt="Clean Diagram">
            </div>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ All diagrams rendered successfully!"
echo "📄 Open preview.html in your browser to view all diagrams"