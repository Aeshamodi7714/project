import React, { useState } from 'react';
import { Book, Search, Download, ExternalLink, X, BookOpen, Star, Clock } from 'lucide-react';

const Books = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    const bookLibrary = [
        {
            id: 1,
            title: "Eloquent JavaScript",
            author: "Marijn Haverbeke",
            category: "Programming",
            rating: 4.8,
            pages: 472,
            description: "A modern introduction to programming, JavaScript, and the wonders of the digital. This book dives deep into the language, from basic syntax to advanced functional programming.",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
            content: "JavaScript is a versatile language that powers the web. It started as a simple scripting tool but has grown into a powerhouse for both frontend and backend development. In this book, we explore the core principles of the language..."
        },
        {
            id: 2,
            title: "Cracking the Coding Interview",
            author: "Gayle Laakmann McDowell",
            category: "Career",
            rating: 4.9,
            pages: 687,
            description: "The most popular book for preparing for technical interviews. It contains 189 programming questions and solutions, from binary trees to scaling systems.",
            image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&auto=format&fit=crop&q=60",
            content: "Technical interviews are about more than just coding; they're about problem-solving and communication. A candidate must demonstrate the ability to think through complex problems under pressure..."
        },
        {
            id: 3,
            title: "You Don't Know JS Yet",
            author: "Kyle Simpson",
            category: "Programming",
            rating: 4.7,
            pages: 250,
            description: "A series of books diving into the core mechanisms of the JavaScript language. This edition focuses on 'Get Started' and the basic building blocks.",
            image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60",
            content: "Most developers learn enough JS to get by, but few truly understand how the engine works. This book challenges your assumptions and forces you to think deep about scope, closures, and prototypes..."
        },
        {
            id: 4,
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "Best Practices",
            rating: 4.8,
            pages: 464,
            description: "A handbook of agile software craftsmanship. Learn how to write code that is easy to read, maintain, and refactor by following time-tested principles.",
            image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
            content: "Writing code is easy; writing clean code is hard. Clean code looks like well-written prose. It never obscures the designer's intent, but rather is filled with crisp abstractions..."
        },
        {
            id: 5,
            title: "Understanding Machine Learning",
            author: "Shai Shalev-Shwartz",
            category: "AI/ML",
            rating: 4.6,
            pages: 440,
            description: "Provides a theoretical foundation for machine learning. Covers everything from the PAC learning model to neural networks and deep learning.",
            image: "https://images.unsplash.com/photo-1509228468518-180dd48632a2?w=800&auto=format&fit=crop&q=60",
            content: "Machine learning is the study of algorithms that improve through experience. At its heart, it's about finding patterns in data and using those patterns to make predictions about the future..."
        },
        {
            id: 6,
            title: "Fullstack React",
            author: "Anthony Accomazzo",
            category: "Development",
            rating: 4.7,
            pages: 825,
            description: "The complete guide to React and Friends. Learn how to build production-ready applications with React, Redux, GraphQL, and more.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
            content: "React has revolutionized the way we build user interfaces. By using a declarative approach and a virtual DOM, it allows developers to build fast, responsive, and maintainable applications..."
        },
        {
            id: 7,
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt",
            category: "Philosophy",
            rating: 4.9,
            pages: 352,
            description: "A masterpiece that cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
            image: "https://images.unsplash.com/photo-1621355674176-1cbb60ad10bc?w=800&auto=format&fit=crop&q=60",
            content: "A pragmatic programmer takes charge of their own career. They aren't afraid to admit ignorance, and they are constantly looking for ways to improve their craft. Tools come and go, but the principles of good software remain..."
        }
    ];

    const filteredBooks = bookLibrary.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                    <button className="primary-btn full-width">
                                        <BookOpen size={18} /> Start Reading
                                    </button>
                                    <button className="secondary-btn full-width">
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
            `}</style>
        </div>
    );
};

export default Books;
