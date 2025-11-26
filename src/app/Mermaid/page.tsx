"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import mermaid from "mermaid";

// Initialize mermaid with config
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  },
});

interface MermaidEditorProps {
  initialCode?: string;
}

const defaultCode = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

const exampleCodes = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
  sequence: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click Login
    Frontend->>Backend: POST /api/login
    Backend->>Database: Query user
    Database-->>Backend: User data
    Backend-->>Frontend: JWT Token
    Frontend-->>User: Redirect to Dashboard`,
  classDiagram: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  erDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : "ordered in"
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date created
    }`,
};

export default function MermaidEditor({ initialCode }: MermaidEditorProps) {
  const [code, setCode] = useState(initialCode || defaultCode);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderCount = useRef(0);

  // Render mermaid diagram
  const renderDiagram = useCallback(async () => {
    if (!code.trim()) {
      setSvg("");
      setError("");
      return;
    }

    setIsRendering(true);
    setError("");

    try {
      // Create unique ID for each render
      const id = `mermaid-${Date.now()}-${renderCount.current++}`;
      
      // Validate syntax first
      await mermaid.parse(code);
      
      // Render the diagram
      const { svg: renderedSvg } = await mermaid.render(id, code);
      setSvg(renderedSvg);
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError(err instanceof Error ? err.message : "Failed to render diagram");
      setSvg("");
    } finally {
      setIsRendering(false);
    }
  }, [code]);

  // Auto-render on code change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram();
    }, 500);

    return () => clearTimeout(timer);
  }, [renderDiagram]);

  // Download as SVG
  const downloadSVG = () => {
    if (!svg) return;
    
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download as PNG
  const downloadPNG = async () => {
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Create blob URL for SVG
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas size with higher resolution
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      if (ctx) {
        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Scale and draw image
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
      }

      // Download
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "diagram.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // Copy SVG to clipboard
  const copySVG = async () => {
    if (!svg) return;
    
    try {
      await navigator.clipboard.writeText(svg);
      alert("SVG copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Load example
  const loadExample = (type: keyof typeof exampleCodes) => {
    setCode(exampleCodes[type]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🧜‍♀️ Mermaid Diagram Editor
        </h1>

        {/* Example Buttons */}
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <span className="text-gray-600 self-center">ตัวอย่าง:</span>
          <button
            onClick={() => loadExample("flowchart")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Flowchart
          </button>
          <button
            onClick={() => loadExample("sequence")}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Sequence
          </button>
          <button
            onClick={() => loadExample("classDiagram")}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Class Diagram
          </button>
          <button
            onClick={() => loadExample("erDiagram")}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            ER Diagram
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-medium">📝 Editor</span>
              <span className="text-sm text-gray-400">Mermaid Syntax</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mermaid code here..."
              spellCheck={false}
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-medium">👁️ Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={copySVG}
                  disabled={!svg}
                  className="px-2 py-1 text-xs bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  📋 Copy
                </button>
                <button
                  onClick={downloadSVG}
                  disabled={!svg}
                  className="px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ⬇️ SVG
                </button>
                <button
                  onClick={downloadPNG}
                  disabled={!svg}
                  className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ⬇️ PNG
                </button>
              </div>
            </div>
            <div
              ref={containerRef}
              className="h-96 p-4 overflow-auto flex items-center justify-center bg-gray-50"
            >
              {isRendering ? (
                <div className="text-gray-500">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Rendering...
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg max-w-full overflow-auto">
                  <p className="font-medium mb-2">❌ Syntax Error:</p>
                  <pre className="text-sm whitespace-pre-wrap">{error}</pre>
                </div>
              ) : svg ? (
                <div
                  dangerouslySetInnerHTML={{ __html: svg }}
                  className="mermaid-output max-w-full"
                />
              ) : (
                <div className="text-gray-400">
                  Enter mermaid code to see preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">Flowchart</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`flowchart TD
  A[Box] --> B(Round)
  B --> C{Diamond}
  C -->|Yes| D[Result]`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-2">Sequence</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`sequenceDiagram
  A->>B: Request
  B-->>A: Response`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-purple-600 mb-2">Class</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`classDiagram
  class Animal {
    +name: string
    +eat()
  }`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">ER Diagram</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`erDiagram
  USER ||--o{ ORDER
  ORDER ||--|{ ITEM`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
