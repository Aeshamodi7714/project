import React, { useState } from 'react';
import { Book, Search, Download, ExternalLink, X, BookOpen, Star, Clock } from 'lucide-react';

const Books = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [readingBook, setReadingBook] = useState(null);

    const handleStartReading = (book) => {
        setSelectedBook(null);
        setReadingBook(book);
    };

    const handleDownloadPDF = (book) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${book.title} - PDF</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;800&display=swap');
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Merriweather', serif; color: #1a1a2e; background: #fff; }
                    .cover-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 4rem; text-align: center; border-bottom: 2px solid #e2e8f0; page-break-after: always; }
                    .cover-page img { width: 240px; height: 360px; object-fit: cover; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); margin-bottom: 3rem; }
                    .cover-title { font-family: 'Inter', sans-serif; font-size: 3rem; font-weight: 800; color: #1a1a2e; margin-bottom: 1rem; line-height: 1.2; }
                    .cover-author { font-size: 1.3rem; color: #4a5568; margin-bottom: 2rem; }
                    .cover-badge { display: inline-block; background: #6366f1; color: white; padding: 0.4rem 1.2rem; border-radius: 100px; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
                    .content-page { padding: 4rem 5rem; max-width: 800px; margin: 0 auto; }
                    .section-title { font-family: 'Inter', sans-serif; font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid #6366f1; }
                    .synopsis { font-size: 1.1rem; line-height: 1.9; color: #2d3748; margin-bottom: 3rem; padding: 1.5rem; background: #f7f8ff; border-left: 4px solid #6366f1; border-radius: 4px; }
                    .chapter-title { font-family: 'Inter', sans-serif; font-size: 1.4rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.5rem; }
                    .body-text { font-size: 1.05rem; line-height: 1.9; color: #4a5568; margin-bottom: 1.5rem; }
                    .meta { font-family: 'Inter', sans-serif; display: flex; gap: 2rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; font-size: 0.9rem; color: #6b7280; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body>
                <div class="cover-page">
                    <img src="${book.image}" alt="${book.title}" />
                    <div class="cover-title">${book.title}</div>
                    <div class="cover-author">by ${book.author}</div>
                    <span class="cover-badge">${book.category}</span>
                    <div class="meta">
                        <span>⭐ ${book.rating} / 5.0</span>
                        <span>📖 ${book.pages} Pages</span>
                    </div>
                </div>
                <div class="content-page">
                    <div class="section-title">Synopsis</div>
                    <div class="synopsis">${book.description}</div>
                    <div class="chapter-title">Chapter 1 — Preview</div>
                    <div class="body-text">${book.content}</div>
                    <div class="body-text">The landscape of software development is constantly shifting. New tools, libraries, and frameworks appear daily. However, the fundamental principles of good engineering remain constant. Understanding these core concepts is what separates a coder from a true software engineer.</div>
                    <div class="body-text">In this chapter, we will explore the historical context of <em>${book.title}</em> and why it remains relevant today. We'll strip away the complexity and focus on the raw building blocks that make up robust systems.</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 600);
    };

    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => {
                setLibrary(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching library:', err);
                setLoading(false);
            });
    }, []);

    const filteredBooks = library.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-state glass">Exploring Digital Archives...</div>;

    return (
        <div className="books-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Library 📖</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Explore our curated collection of technical and academic books.</p>
                </div>
                <div className="search-bar glass" style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.4rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search books, authors..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2.5rem' }}>
                {filteredBooks.map(book => (
                    <div key={book.id} className="card book-card">
                        <div className="book-cover-container">
                            <img src={book.image} alt={book.title} className="book-cover-img" />
                            <div className="book-overlay">
                                <button className="read-btn" onClick={() => setSelectedBook(book)}>
                                    <BookOpen size={20} /> Read Now
                                </button>
                            </div>
                            <div className="category-badge">{book.category}</div>
                        </div>
                        <div className="book-info">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">{book.author}</p>
                            <div className="book-meta">
                                <span className="rating">
                                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> {book.rating}
                                </span>
                                <span className="pages">{book.pages} Pages</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedBook && (
                <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedBook(null)}>
                    <div className="book-modal glass" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedBook(null)}>
                            <X size={24} />
                        </button>

                        <div className="modal-content">
                            <aside className="modal-sidebar">
                                <div className="modal-book-cover shadow-lg">
                                    <img src={selectedBook.image} alt={selectedBook.title} />
                                </div>
                                <div className="modal-actions">
                                    <button className="primary-btn full-width" onClick={() => handleStartReading(selectedBook)}>
                                        <BookOpen size={18} /> Start Reading
                                    </button>
                                    <button className="secondary-btn full-width" onClick={() => handleDownloadPDF(selectedBook)}>
                                        <Download size={18} /> Download PDF
                                    </button>
                                </div>
                                <div className="modal-stats">
                                    <div className="stat">
                                        <Clock size={16} /> <span>12h read</span>
                                    </div>
                                    <div className="stat">
                                        <Star size={16} fill="currentColor" /> <span>{selectedBook.rating}/5.0</span>
                                    </div>
                                </div>
                            </aside>

                            <main className="modal-main">
                                <div className="modal-header">
                                    <span className="modal-category">{selectedBook.category}</span>
                                    <h2>{selectedBook.title}</h2>
                                    <p className="modal-author">by <span>{selectedBook.author}</span></p>
                                </div>

                                <div className="modal-body custom-scrollbar">
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Synopsis</h4>
                                    <p className="modal-description">{selectedBook.description}</p>

                                    <hr className="divider" />

                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text)' }}>Preview: Chapter 1</h4>
                                    <div className="preview-text">
                                        {selectedBook.content}
                                        <br /><br />
                                        The landscape of software development is constantly shifting. New tools, libraries, and frameworks appear daily. However, the fundamental principles of good engineering remain constant. Understanding these core concepts is what separates a coder from a true software engineer.
                                        <br /><br />
                                        In this chapter, we will explore the historical context of {selectedBook.title} and why it remains relevant today. We'll strip away the complexity and focus on the raw building blocks that make up robust systems.
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== FULL-SCREEN READER ===== */}
            {readingBook && (
                <div className="reader-backdrop animate-fade-in">
                    <div className="reader-topbar">
                        <button className="reader-back-btn" onClick={() => setReadingBook(null)}>
                            <X size={20} /> Close Reader
                        </button>
                        <div className="reader-book-title">
                            <BookOpen size={18} />
                            <span>{readingBook.title}</span>
                        </div>
                        <button className="reader-download-btn" onClick={() => handleDownloadPDF(readingBook)}>
                            <Download size={16} /> Download PDF
                        </button>
                    </div>
                    <div className="reader-body">
                        <div className="reader-content">
                            <div className="reader-chapter-label">Chapter 1</div>
                            <h1 className="reader-title">{readingBook.title}</h1>
                            <p className="reader-author">by <strong>{readingBook.author}</strong></p>
                            <hr className="reader-divider" />
                            <h3 className="reader-section">Synopsis</h3>
                            <p className="reader-para">{readingBook.description}</p>
                            <hr className="reader-divider" />
                            <h3 className="reader-section">Chapter 1 — Getting Started</h3>
                            <p className="reader-para">{readingBook.content}</p>
                            <p className="reader-para">The landscape of software development is constantly shifting. New tools, libraries, and frameworks appear daily. However, the fundamental principles of good engineering remain constant. Understanding these core concepts is what separates a coder from a true software engineer.</p>
                            <p className="reader-para">In this chapter, we will explore the historical context of <em>{readingBook.title}</em> and why it remains relevant today. We'll strip away the complexity and focus on the raw building blocks that make up robust systems — concepts that have stood the test of time because they address the fundamental challenges of writing software that works, scales, and endures.</p>
                            <p className="reader-para">As you progress through these pages, you will encounter ideas that challenge your current understanding, exercises that stretch your thinking, and examples that illuminate abstract concepts with real-world scenarios. The journey ahead is both demanding and rewarding.</p>
                            <div className="reader-end-note">✦ End of Preview ✦</div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .books-wrapper { padding-bottom: 3rem; }
                
                /* Book Grid & Card */
                .book-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 1.2rem;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .book-card:hover {
                    transform: translateY(-8px);
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(99, 102, 241, 0.3);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
                }

                .book-cover-container {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 2/3;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                }
                .book-cover-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .book-card:hover .book-cover-img {
                    transform: scale(1.05);
                }
                .book-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                .book-card:hover .book-overlay {
                    opacity: 1;
                }
                .read-btn {
                    background: white;
                    color: var(--primary); /* Deep Indigo */
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 100px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transform: translateY(20px);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .book-card:hover .read-btn {
                    transform: translateY(0);
                }
                .category-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(15, 23, 42, 0.8);
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .book-info { margin-top: 0.5rem; }
                .book-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    margin-bottom: 0.3rem;
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .book-author {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 0.8rem;
                }
                .book-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .rating { display: flex; alignItems: center; gap: 0.3rem; color: #fbbf24; }
                .pages { color: var(--text-muted); }

                /* Modal Styling */
                .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(5, 7, 15, 0.8);
                    backdrop-filter: blur(16px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .book-modal {
                    width: 100%;
                    max-width: 1000px;
                    height: 85vh;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 32px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.6);
                    display: flex;
                    flex-direction: column;
                }
                .modal-content {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    height: 100%;
                    overflow: hidden;
                }
                
                .close-modal-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.2s;
                }
                .close-modal-btn:hover {
                    background: var(--danger);
                    border-color: var(--danger);
                    transform: rotate(90deg);
                }

                /* Modal Sidebar */
                .modal-sidebar {
                    background: rgba(15, 23, 42, 0.4);
                    padding: 2.5rem;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    overflow-y: auto;
                }
                .modal-book-cover {
                    width: 100%;
                    aspect-ratio: 2/3;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 4px solid rgba(255,255,255,0.05);
                }
                .modal-book-cover img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .modal-actions {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: 0.3s;
                }
                .primary-btn:hover { filter: brightness(1.1); box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                .secondary-btn {
                    background: rgba(255,255,255,0.05);
                    color: var(--text);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: 0.3s;
                }
                .secondary-btn:hover { background: rgba(255,255,255,0.1); }
                
                .modal-stats {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: auto;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .stat { display: flex; alignItems: center; gap: 0.5rem; }

                /* Modal Main */
                .modal-main {
                    padding: 3rem 4rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .modal-category {
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                    display: block;
                }
                .modal-header h2 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 0.5rem;
                }
                .modal-header { margin-bottom: 2.5rem; }
                .modal-author {
                    font-size: 1.1rem;
                    color: var(--text-muted);
                }
                .modal-author span { color: var(--text); font-weight: 600; }
                
                .divider {
                    border: 0;
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                    margin: 2rem 0;
                }

                .modal-description, .preview-text {
                    color: var(--text-muted);
                    font-size: 1.05rem;
                    line-height: 1.7;
                }
                .preview-text {
                    font-family: 'Merriweather', serif; /* Or system serif */
                    background: rgba(0,0,0,0.2);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 3px solid var(--primary);
                }

                /* Mobile Responsive */
                @media (max-width: 900px) {
                    .modal-content { grid-template-columns: 1fr; overflow-y: auto; }
                    .modal-sidebar { flex-direction: row; padding: 2rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
                    .modal-book-cover { width: 120px; flex-shrink: 0; }
                    .modal-actions { align-items: flex-start; }
                    .book-modal { height: 95vh; }
                    .modal-main { padding: 2rem; }
                }
                @media (max-width: 600px) {
                    .modal-sidebar { flex-direction: column; }
                    .modal-book-cover { width: 160px; }
                    .modal-actions { width: 100%; }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                /* ===== Full-Screen Reader ===== */
                .reader-backdrop {
                    position: fixed;
                    inset: 0;
                    background: #0f172a;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .reader-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 2rem;
                    background: rgba(15, 23, 42, 0.95);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(10px);
                    flex-shrink: 0;
                }
                .reader-back-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: white; padding: 0.55rem 1.1rem; border-radius: 10px;
                    cursor: pointer; font-size: 0.9rem; font-weight: 600;
                    transition: background 0.2s;
                }
                .reader-back-btn:hover { background: rgba(239, 68, 68, 0.25); border-color: rgba(239,68,68,0.4); }
                .reader-book-title {
                    display: flex; align-items: center; gap: 0.6rem;
                    color: rgba(255,255,255,0.7); font-size: 0.95rem; font-weight: 600;
                }
                .reader-download-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    background: var(--primary); border: none; color: white;
                    padding: 0.55rem 1.1rem; border-radius: 10px;
                    cursor: pointer; font-size: 0.9rem; font-weight: 600;
                    transition: filter 0.2s;
                }
                .reader-download-btn:hover { filter: brightness(1.15); }
                .reader-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 3rem 1rem 5rem;
                    background: #1e293b;
                }
                .reader-content {
                    max-width: 720px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 12px;
                    padding: 4rem 5rem;
                    color: #1a202c;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
                }
                .reader-chapter-label {
                    font-family: sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #6366f1;
                    margin-bottom: 1rem;
                }
                .reader-title {
                    font-family: 'Georgia', serif;
                    font-size: 2.6rem;
                    font-weight: 900;
                    line-height: 1.15;
                    margin-bottom: 0.6rem;
                    color: #0f172a;
                }
                .reader-author {
                    font-size: 1.05rem;
                    color: #64748b;
                    margin-bottom: 2.5rem;
                }
                .reader-divider {
                    border: none;
                    border-top: 1px solid #e2e8f0;
                    margin: 2.5rem 0;
                }
                .reader-section {
                    font-family: 'Georgia', serif;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 1.2rem;
                }
                .reader-para {
                    font-family: 'Georgia', serif;
                    font-size: 1.1rem;
                    line-height: 1.9;
                    color: #374151;
                    margin-bottom: 1.5rem;
                }
                .reader-end-note {
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-top: 3rem;
                    letter-spacing: 3px;
                }
                @media (max-width: 768px) {
                    .reader-content { padding: 2.5rem 1.8rem; }
                    .reader-title { font-size: 2rem; }
                    .reader-topbar { padding: 0.8rem 1rem; }
                }
            `}</style>
        </div>
    );
};

export default Books;
