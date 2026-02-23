import React, { useState } from 'react';
import { BookOpen, Clock, PlayCircle, Trophy, Star, X, Info, ChevronRight } from 'lucide-react';

const ALL_COURSES = [
    {
        id: 1,
        title: "Advanced React Patterns 2024",
        instructor: "Dr. Logic",
        progress: 75,
        lessons: 24,
        duration: "12h 30m",
        category: "Development",
        description: "Master advanced React concepts like Higher-Order Components, Render Props, and Compound Components. This course covers everything you need to build scalable frontend architectures. You will learn how to optimize performance and manage complex state logic effectively.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8" // React Full Course (FreeCodeCamp)
    },
    {
        id: 2,
        title: "Full Stack Ecosystems",
        instructor: "Prof. Byte",
        progress: 30,
        lessons: 42,
        duration: "22h 15m",
        category: "Full Stack",
        description: "Learn how to bridge the gap between frontend and backend. We dive deep into Node.js, Express, and modern database patterns with MongoDB and SQL. Understand authentication, API design, and deployment strategies.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/Nu_pCw8Qxrk" // MERN Stack Full Course
    },
    {
        id: 3,
        title: "AI & Neural Networks",
        instructor: "Neural AI",
        progress: 10,
        lessons: 15,
        duration: "8h 45m",
        category: "AI",
        description: "An introduction to machine learning and deep learning. Understand how neural networks function and how to implement them using Python. We cover backpropagation, activation functions, and model training.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk" // Neural Networks (3Blue1Brown)
    },
    {
        id: 4,
        title: "Python for Data Science",
        instructor: "Data Wizard",
        progress: 0,
        lessons: 30,
        duration: "15h 20m",
        category: "Data Science",
        description: "Unlock the power of data with Python. Learn libraries like Pandas, NumPy, and Matplotlib to analyze and visualize complex datasets. Perform exploratory data analysis and build predictive models.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw" // Python (FreeCodeCamp)
    },
    {
        id: 5,
        title: "Cloud Infrastructure (AWS)",
        instructor: "Sky High",
        progress: 0,
        lessons: 18,
        duration: "10h 10m",
        category: "DevOps",
        description: "Deploy and manage scalable applications on AWS. Cover EC2, S3, Lambda, and architectural best practices for the cloud. Learn how to set up VPCs and manage IAM roles securely.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/ulprqHHWgvQ" // AWS Basics
    },
    {
        id: 6,
        title: "UI/UX Design Masterclass",
        instructor: "Pixel Perfect",
        progress: 0,
        lessons: 25,
        duration: "14h 45m",
        category: "Design",
        description: "Design beautiful and intuitive user interfaces. From wireframing in Figma to prototyping interactive user flows. Learn color theory, typography, and accessibility best practices.",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/c9Wg6WmSzjs" // UI/UX Design
    },
    {
        id: 7,
        title: "Cyber Security Fundamentals",
        instructor: "Shadow Blade",
        progress: 0,
        lessons: 20,
        duration: "11h 30m",
        category: "Security",
        description: "Protect systems from cyber threats. Learn about penetration testing, encryption, and secure network protocols. Understand common vulnerabilities like SQL injection and XSS.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/nzj7Wg4DAbs" // Cyber Security
    },
    {
        id: 8,
        title: "DevOps Pipeline Automation",
        instructor: "Dr. Jenkins",
        progress: 0,
        lessons: 22,
        duration: "13h 05m",
        category: "DevOps",
        description: "Automate your software delivery. Master CI/CD pipelines with GitHub Actions, Docker, and Kubernetes. Learn how to implement continuous integration and deployment for modern applications.",
        image: "https://images.unsplash.com/photo-1618401471353-b98aade25588?w=800&auto=format&fit=crop&q=60",
        videoUrl: "https://www.youtube.com/embed/hQcFE0RD0cQ" // DevOps
    }
];

const MyCourses = () => {
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const navigate = React.useRouter ? React.useRouter() : null; // Getting navigate if available or using window

    React.useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const courseTitle = query.get('title');
        if (courseTitle) {
            const course = ALL_COURSES.find(c => c.title.toLowerCase().includes(courseTitle.toLowerCase()));
            if (course) setSelectedCourse(course);
        }
    }, [window.location.search]);

    const handleTakeQuiz = (course) => {
        // Redirect to quizzes page with search query
        window.location.href = `/quizzes?search=${encodeURIComponent(course.title)}`;
    };

    const courses = ALL_COURSES;
    const relatedCourses = courses.filter(c => c.id !== selectedCourse?.id);

    return (
        <div className="courses-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Academic Path 📚</h1>
                <p className="text-muted">Currently enrolled in {courses.length} high-impact courses.</p>
            </header>

            {!selectedCourse ? (
                <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {courses.map(course => (
                        <div key={course.id} className="card course-card">
                            <div className="course-image" style={{ height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                                <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div className="category-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>{course.category}</div>
                                <div className="play-overlay" onClick={() => setSelectedCourse(course)}>
                                    <PlayCircle size={48} color="white" />
                                </div>
                            </div>

                            <div className="course-info">
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem', fontWeight: 700 }}>{course.title}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>By {course.instructor}</p>

                                <div className="progress-section" style={{ marginBottom: '1.5rem' }}>
                                    <div className="progress-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 700 }}>
                                        <span>Course Progress</span>
                                        <span style={{ color: 'var(--primary)' }}>{course.progress}%</span>
                                    </div>
                                    <div className="p-bar-bg" style={{ height: '10px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div className="p-bar-fill" style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}></div>
                                    </div>
                                </div>

                                <div className="course-meta" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {course.duration}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><PlayCircle size={16} /> {course.lessons} Lessons</span>
                                </div>

                                <button className="auth-btn" style={{ padding: '0.9rem', marginTop: 0 }} onClick={() => setSelectedCourse(course)}>
                                    <PlayCircle size={18} /> Resume Learning
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="video-learning-environment animate-fade-in">
                    <button className="back-to-library" onClick={() => setSelectedCourse(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> Back to Library
                    </button>

                    <div className="player-layout">
                        <div className="main-content-area">
                            <div className="video-vessel shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={selectedCourse.videoUrl}
                                    title={selectedCourse.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="video-details glass" style={{ marginTop: '2rem', padding: '2rem', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedCourse.title}</h1>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <span>{selectedCourse.instructor}</span>
                                            <span>•</span>
                                            <span>{selectedCourse.category}</span>
                                            <span>•</span>
                                            <span style={{ color: 'var(--primary)' }}>{selectedCourse.lessons} Lessons</span>
                                        </div>
                                    </div>
                                    <button className="auth-btn" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
                                        <Trophy size={18} /> Claim Certificate
                                    </button>
                                </div>
                                <hr style={{ opacity: 0.1, margin: '1.5rem 0' }} />
                                <div className="description-section">
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                        <Info size={18} color="var(--primary)" /> About this Course
                                    </h3>
                                    <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedCourse.description}</p>

                                    <button
                                        onClick={() => handleTakeQuiz(selectedCourse)}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: '#818cf8',
                                            border: '1px solid #6366f1',
                                            padding: '0.8rem 1.5rem',
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                    >
                                        <BookOpen size={18} /> Take Quiz
                                    </button>
                                </div>
                            </div>
                        </div>

                        <aside className="related-videos-sidebar">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Up Next</h3>
                            <div className="related-list">
                                {relatedCourses.map(course => (
                                    <div key={course.id} className="related-card glass" onClick={() => setSelectedCourse(course)}>
                                        <div className="related-thumb">
                                            <img src={course.image} alt="" />
                                            <div className="thumb-overlay"><PlayCircle size={24} /></div>
                                        </div>
                                        <div className="related-info">
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>{course.title}</h4>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{course.instructor}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            )}

            <style jsx>{`
                .player-layout { display: grid; grid-template-columns: 1fr 350px; gap: 2.5rem; }
                .video-vessel { 
                    width: 100%; aspect-ratio: 16/9; background: black; border-radius: 24px; 
                    overflow: hidden; border: 1px solid var(--border); box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                }
                .related-videos-sidebar { max-height: 80vh; overflow-y: auto; padding-right: 0.5rem; }
                .related-list { display: flex; flexDirection: column; gap: 1rem; }
                .related-card { 
                    display: grid; grid-template-columns: 100px 1fr; gap: 1rem; padding: 0.75rem; 
                    border-radius: 16px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
                }
                .related-card:hover { border-color: var(--primary); background: rgba(255,255,255,0.05); }
                .related-thumb { position: relative; height: 60px; border-radius: 10px; overflow: hidden; }
                .related-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; }
                .related-card:hover .thumb-overlay { opacity: 1; }

                .course-card { transition: all 0.3s ease; cursor: default; }
                .course-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
                .play-overlay { 
                    position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
                    display: flex; align-items: center; justify-content: center; 
                    opacity: 0; transition: opacity 0.3s; cursor: pointer;
                }
                .course-image:hover .play-overlay { opacity: 1; }
                
                @media (max-width: 1100px) {
                    .player-layout { grid-template-columns: 1fr; }
                    .related-videos-sidebar { max-height: none; }
                }
            `}</style>
        </div>
    );
};

export default MyCourses;
