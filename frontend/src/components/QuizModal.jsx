import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, Brain, AlertCircle, ChevronRight, Check, Info, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizModal = ({ quiz, onClose, userId, onComplete }) => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [aiFeedback, setAiFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [userChoices, setUserChoices] = useState([]); // Track all choices
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (finished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    submitQuiz();
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [finished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNext = () => {
        const isCorrect = selectedOption === quiz.questions[currentQuestion].correctOption;

        // Save choice
        const newChoice = {
            question: quiz.questions[currentQuestion].questionText,
            selected: selectedOption,
            correct: quiz.questions[currentQuestion].correctOption,
            options: quiz.questions[currentQuestion].options,
            isCorrect: isCorrect
        };

        setUserChoices([...userChoices, newChoice]);

        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (currentQuestion + 1 < quiz.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            submitQuiz(newScore);
        }
    };

    const submitQuiz = async (finalRawScore = score) => {
        setLoading(true);
        const finalPercentage = (finalRawScore / quiz.questions.length) * 100;

        try {
            const API_BASE = `http://${window.location.hostname}:5000`;
            const response = await fetch(`${API_BASE}/api/quiz/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    quizId: quiz._id,
                    score: finalPercentage,
                    timeSpent: 300 - timeLeft
                })
            });
            const result = await response.json();
            setAiFeedback(result.feedback);
        } catch (err) {
            console.error(err);
            setAiFeedback("Assessment complete. Your understanding is being integrated into your learning profile.");
        } finally {
            setFinished(true);
            setLoading(false);
        }
    };

    const handleLearnMore = () => {
        const searchQuery = quiz.title.split(' ')[0] || quiz.category;
        navigate(`/courses?title=${encodeURIComponent(searchQuery)}`);
        onClose();
    };

    const getScoreFeedback = (perc) => {
        if (perc < 40) return { label: "Poor Score", color: "#f43f5e", emoji: "😢" };
        if (perc < 75) return { label: "Good Effort", color: "#f59e0b", emoji: "🧐" };
        return { label: "Excellent Master!", color: "#10b981", emoji: "🏆" };
    };

    const feedback = getScoreFeedback((score / quiz.questions.length) * 100);

    return (
        <div className="modal-overlay">
            <div className="quiz-modal card glass-dark animate-slide-up">
                {/* STICKY HEADER AREA */}
                <div className="modal-fixed-header">
                    <div className="quiz-info-mini">
                        <span className="cat-tag">{quiz.category}</span>
                        <span className="diff-tag">{quiz.difficulty}</span>
                    </div>
                    <button className="quiz-corner-close" onClick={onClose} title="Close">
                        <X size={18} />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="modal-scroll-body">
                    {!finished ? (
                        <>
                            <div className="quiz-progress-section">
                                <div className="progress-header">
                                    <span className="q-count">Question {currentQuestion + 1}/{quiz.questions.length}</span>
                                    <div className={`timer-pill ${timeLeft < 60 ? 'warning' : ''}`}>
                                        <Clock size={14} />
                                        <span>{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="quiz-question-body">
                                <h2 className="q-text">{quiz.questions[currentQuestion].questionText}</h2>
                                <div className="options-grid">
                                    {quiz.questions[currentQuestion].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`opt-btn ${selectedOption === idx ? 'selected' : ''}`}
                                            onClick={() => setSelectedOption(idx)}
                                        >
                                            <div className="opt-letter">{String.fromCharCode(65 + idx)}</div>
                                            <div className="opt-content">{option}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="quiz-actions-footer">
                                <button
                                    className="action-btn"
                                    disabled={selectedOption === null || loading}
                                    onClick={handleNext}
                                >
                                    {loading ? '...' : (currentQuestion + 1 === quiz.questions.length ? 'Finish' : 'Next')}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="quiz-results-view animate-fade-in">
                            <div className="results-header">
                                <div className="hero-emoji">{feedback.emoji}</div>
                                <h1 style={{ color: feedback.color, margin: '0.2rem 0', fontSize: '1.2rem' }}>{feedback.label}</h1>
                                <div className="score-summary">
                                    <span className="score-main" style={{ fontSize: '1rem', color: '#64748b' }}>{score} / {quiz.questions.length} Correct</span>
                                </div>
                            </div>

                            <div className="ai-feedback-box">
                                <div className="ai-label"><Brain size={14} /> Insight Analysis</div>
                                <p style={{ margin: '0', fontSize: '0.75rem', color: '#cbd5e1' }}>{aiFeedback}</p>
                            </div>

                            {/* MOVED CTA: Right after feedback box as requested */}
                            <div className="cta-section-inline">
                                <button className="start-study-btn" onClick={handleLearnMore}>
                                    <BookOpen size={18} />
                                    <span>Start Study</span>
                                </button>
                                <p className="improve-tag">Improve your score</p>
                            </div>

                            <div className="wrong-answers-review">
                                <h3 style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>Review Solutions</h3>
                                <div className="review-scroll">
                                    {userChoices.map((choice, idx) => (
                                        <div key={idx} className={`review-item ${choice.isCorrect ? 'correct' : 'incorrect'}`}>
                                            <p className="review-q">{idx + 1}. {choice.question}</p>
                                            <div className="review-ans-grid">
                                                <div className="ans-line">Your: <span className={choice.isCorrect ? 'correct-val' : 'your-val'}>{choice.options[choice.selected]}</span></div>
                                                {!choice.isCorrect && (
                                                    <div className="ans-line">Right: <span className="correct-val">{choice.options[choice.correct]}</span></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(2, 4, 15, 0.98);
                    backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center;
                    z-index: 9999; padding: 1rem;
                }
                .quiz-modal {
                    width: 100%; maxWidth: 320px; maxHeight: 65vh;
                    background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px; display: flex; flex-direction: column;
                    position: relative; overflow: hidden; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5);
                }
                .modal-fixed-header {
                    padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.03);
                    display: flex; justify-content: space-between; align-items: center;
                }
                .modal-scroll-body { padding: 0.75rem; overflow-y: auto; flex: 1; }
                .modal-scroll-body::-webkit-scrollbar { width: 3px; }
                .modal-scroll-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

                .quiz-corner-close {
                    background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2);
                    color: #f43f5e; width: 24px; height: 24px; border-radius: 4px;
                    display: flex; align-items: center; justify-content: center; cursor: pointer;
                }
                
                .cat-tag { background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 1px 5px; border-radius: 3px; font-size: 0.55rem; font-weight: 800; text-transform: uppercase; }
                .diff-tag { color: #475569; font-size: 0.55rem; font-weight: 700; text-transform: uppercase; margin-left: 0.4rem; }
                
                .quiz-progress-section { margin-bottom: 0.6rem; }
                .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem; }
                .q-count { font-size: 0.6rem; color: #64748b; font-weight: 700; }
                .timer-pill { color: #475569; font-weight: 800; font-size: 0.65rem; display: flex; align-items: center; gap: 3px; }
                .progress-track { height: 2px; background: rgba(255,255,255,0.02); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: #6366f1; }

                .q-text { font-size: 0.95rem; font-weight: 950; margin-bottom: 0.6rem; line-height: 1.25; color: white; }
                .options-grid { display: grid; gap: 0.3rem; }
                .opt-btn { 
                    background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); 
                    padding: 0.5rem; border-radius: 6px; color: #94a3b8; text-align: left; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; transition: 0.2s;
                }
                .opt-btn.selected { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; color: white; }
                .opt-letter { width: 18px; height: 18px; background: rgba(255,255,255,0.03); border-radius: 3px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.6rem; }
                .opt-content { font-weight: 700; font-size: 0.75rem; }

                .quiz-actions-footer { margin-top: 0.75rem; display: flex; justify-content: flex-end; }
                .action-btn { background: #6366f1; color: white; padding: 0.4rem 0.8rem; border-radius: 4px; border: none; font-weight: 800; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; gap: 3px; }

                .results-header { text-align: center; margin-bottom: 0.6rem; }
                .score-summary { margin-top: 0.2rem; }
                
                .ai-feedback-box { background: rgba(99, 102, 241, 0.03); border: 1px solid rgba(99, 102, 241, 0.08); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.6rem; }
                .ai-label { color: #818cf8; font-weight: 900; font-size: 0.55rem; text-transform: uppercase; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 3px; }
                
                .cta-section-inline { text-align: center; margin-bottom: 1rem; background: rgba(99, 102, 241, 0.05); padding: 0.6rem; border-radius: 10px; border: 1px solid rgba(99, 102, 241, 0.08); }
                .improve-tag { color: #475569; font-size: 0.55rem; font-weight: 700; text-transform: uppercase; margin-top: 0.3rem; }
                .start-study-btn { 
                    background: #6366f1; color: white; width: 100%; padding: 0.5rem; 
                    border-radius: 4px; border: none; font-weight: 900; font-size: 0.75rem;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
                }

                .review-scroll { display: flex; flex-direction: column; gap: 0.4rem; max-height: 100px; overflow-y: auto; }
                .review-item { padding: 0.5rem; border-radius: 6px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.02); }
                .review-item.correct { border-left: 2px solid #10b981; }
                .review-item.incorrect { border-left: 2px solid #ef4444; }
                .review-q { font-weight: 800; font-size: 0.65rem; margin: 0 0 0.2rem 0; color: #f1f5f9; }
                .ans-line { font-size: 0.6rem; color: #475569; font-weight: 700; }
                .your-val { color: #ef4444; font-weight: 800; }
                .correct-val { color: #10b981; font-weight: 800; }

                @media (max-width: 600px) { .quiz-modal { maxWidth: 95%; maxHeight: 85vh; } }
            `}</style>
        </div>
    );
};

export default QuizModal;
