import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Folder,
  Clock,
  Star,
  Archive,
  HelpCircle,
  HardDrive,
  Bell,
  Settings,
  Plus,
  FileText,
  Search,
  MessageSquare,
  FileUp,
  Library,
} from "lucide-react";
import './index.css';

const API_BASE = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

async function parseApiResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  return {
    error: text || `Request failed with status ${res.status}`,
  };
}

function App() {
  const [, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const endOfMessagesRef = useRef(null);
  const hasConversation = uploaded || messages.length > 0;

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await parseApiResponse(res);

        if (res.ok) {
          setUploaded(true);
          setMessages([
            {
              role: "ai",
              text: `I've successfully analyzed "${selectedFile.name}". What would you like to know about it?`,
            },
          ]);
        } else {
          alert("Upload failed: " + (data.error || "Unknown server error"));
        }
      } catch (err) {
        alert("Error: " + err.message);
      }

      setUploading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newMsgs = [...messages, { role: "user", text: question }];
    setMessages(newMsgs);
    setQuestion("");
    setLoadingMsg(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await parseApiResponse(res);

      if (res.ok) {
        setMessages([...newMsgs, { role: "ai", text: data.answer }]);
      } else {
        setMessages([...newMsgs, { role: "ai", text: "Error: " + (data.error || "Unknown server error") }]);
      }
    } catch (err) {
      setMessages([...newMsgs, { role: "ai", text: "Error: " + err.message }]);
    }

    setLoadingMsg(false);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-wrapper">
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-lockup">
            <div className="brand-mark">
              <Library size={20} />
            </div>
            <div className="brand-copy">
              <span className="brand-eyebrow">Intelligent Workspace</span>
              <div className="logo">PDF AI</div>
            </div>
          </div>

          <nav className="nav-links">
            <button className="active">Workspace</button>
            <button>Analysis</button>
            <button>History</button>
          </nav>
        </div>

        <div className="topbar-right">
          <button className="upgrade-btn">Upgrade Plan</button>
          <div className="icon-btn"><Bell size={20} /></div>
          <div className="icon-btn"><Settings size={20} /></div>
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User avatar" />
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="library-header">
            <div className="library-icon-bg">
              <Library size={18} />
            </div>
            <div>
              <h3>LIBRARY</h3>
              <p>DOCUMENT MANAGEMENT</p>
            </div>
          </div>

          <label className={`upload-btn-sidebar ${uploading ? 'disabled' : ''}`} htmlFor="file-upload">
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload PDF'}
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="file-upload"
            hidden
            onChange={handleFileChange}
            disabled={uploading}
          />

          <div className="sidebar-note">
            <strong>Work faster with one clean workspace.</strong>
            <p>Upload a document, ask follow-up questions, and keep your analysis flowing without leaving the page.</p>
          </div>

          <div className="menu-group">
            <h4>Main</h4>
            <ul>
              <li className="active"><Folder size={18}/> All Documents</li>
              <li><Clock size={18}/> Recent</li>
              <li><Star size={18}/> Starring</li>
              <li><Archive size={18}/> Archived</li>
            </ul>
          </div>

          <div className="menu-group">
            <h4>System</h4>
            <ul>
              <li><HelpCircle size={18}/> Help Center</li>
              <li><HardDrive size={18}/> Storage</li>
            </ul>
          </div>

          <div className="storage-widget">
            <div className="storage-text">
              <span>Free Plan Storage</span>
              <span>85%</span>
            </div>
            <div className="storage-bar">
              <div className="storage-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
        </aside>

        <main className="content">
          {!hasConversation && (
            <section className="hero-panel">
              <div className="landing-view">
                <div className="landing-grid">
                  <div className="hero-section">
                    <span className="hero-kicker">Sharper document conversations</span>
                    <h1>The intelligent <span className="text-blue">PDF copilot.</span></h1>
                    <p>Analyze, summarize, and explore your documents in a focused workspace built for fast uploads, cleaner reading, and smoother follow-up questions on any screen size.</p>

                    <div className="hero-stats">
                      <div className="stat-card">
                        <strong>PDF, DOCX, TXT</strong>
                        <span>Flexible input formats</span>
                      </div>
                      <div className="stat-card">
                        <strong>Instant Q&amp;A</strong>
                        <span>Ask grounded questions after upload</span>
                      </div>
                      <div className="stat-card">
                        <strong>Responsive UI</strong>
                        <span>Comfortable on desktop and mobile</span>
                      </div>
                    </div>

                    <div className="hero-mobile-panel mobile-upload-panel">
                      <h2>Start with an upload</h2>
                      <p>Pick a document to begin a focused conversation with your content.</p>
                      <label className={`upload-btn-sidebar ${uploading ? 'disabled' : ''}`} htmlFor="file-upload">
                        <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload PDF'}
                      </label>
                    </div>
                  </div>

                  <div className="hero-side">
                    <div className="hero-side-panel">
                      <h2>Built for active document work</h2>
                      <p>Keep uploads, context, and follow-up questions in a single calm interface instead of juggling multiple screens.</p>
                      <div className="supported-files">
                        <span className="badge">PDF</span>
                        <span className="badge">DOCX</span>
                        <span className="badge">TXT</span>
                      </div>
                    </div>

                    <div className="hero-side-panel">
                      <h2>What you can do next</h2>
                      <p>Upload a document, extract key ideas, verify facts from context, or continue where your last chat left off.</p>
                    </div>
                  </div>
                </div>

                <div className="action-cards">
                  <div className="card" onClick={() => document.getElementById('file-upload').click()}>
                    <div className="card-icon blue"><FileUp size={24}/></div>
                    <h3>Upload and analyze</h3>
                    <p>Drop in a document and jump directly into a guided conversation about its contents.</p>
                  </div>
                  <div className="card">
                    <div className="card-icon gray"><Search size={24}/></div>
                    <h3>Search your library</h3>
                    <p>Keep your workspace organized and return to important documents without friction.</p>
                  </div>
                  <div className="card">
                    <div className="card-icon cyan"><MessageSquare size={24}/></div>
                    <h3>Continue recent chats</h3>
                    <p>Resume analysis quickly and stay in context instead of starting from scratch each time.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {hasConversation && (
            <section className="chat-shell">
              <div className="chat-header">
                <div className="chat-header-copy">
                  <h2>Document conversation</h2>
                  <p>{uploading ? "Your document is being prepared for questions." : "Ask grounded questions about the uploaded file."}</p>
                </div>
                <div className="chat-status">
                  <span className="chat-status-dot"></span>
                  {uploading ? "Uploading" : "Ready"}
                </div>
              </div>

              <div className="chat-view">
                <div className="chat-history">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`message-wrapper ${msg.role}`}>
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {loadingMsg && (
                    <div className="message-wrapper ai">
                      <div className="message-bubble loading">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </div>

              <div className="chat-input-wrapper">
                <form className="chat-input-pill" onSubmit={handleSend}>
                  <FileText size={20} className="file-icon" />
                  <input
                    type="text"
                    placeholder={uploading ? "Uploading document..." : (uploaded ? "Ask a question about your PDF..." : "Upload a PDF to start chatting...")}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={!uploaded || loadingMsg || uploading}
                  />
                  <button type="submit" className="add-btn" disabled={!uploaded || loadingMsg || !question.trim() || uploading}>
                    <Plus size={20} />
                  </button>
                </form>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
