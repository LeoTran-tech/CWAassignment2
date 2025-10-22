'use client';
import { useEffect, useState } from 'react';
import Nav from '../Components/Navbar';
import BuilderRoom from '../Components/escape-room/BuilderRoom';
import GameCanvas from '../Components/escape-room/GameCanvas';
import GamePanel from '../Components/escape-room/GamePanel';
import OverlayEndScreen from '../Components/escape-room/OverlayEndScreen';
import { Question, ObjectItem } from '../Components/escape-room/types';

const APIURL = 'http://ec2-3-85-115-208.compute-1.amazonaws.com:4080';

export default function EscapeRoom() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  // 🎮 Zoom & drag controls
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // 🕒 Timer
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // 💬 Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [canShowAnswerObject, setCanShowAnswerObject] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const objectsList: ObjectItem[] = [
    { src: '/escape-room/objects-for-coding-challenges/football.svg', action: 'question' },
    { src: '/escape-room/objects-for-coding-challenges/shirt.svg', action: 'hint' },
    { src: '/escape-room/objects-for-coding-challenges/baseball.svg', action: 'if correct' },
    { src: '/escape-room/objects-for-coding-challenges/computer.svg', action: 'answer' },
  ];

  // 🧠 Load all questions from backend
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${APIURL}/api/questions`);
      if (res.ok) {
        const data = await res.json();
        setAllQuestions(data);
        if (data.length > 0) setQuestionCount(1);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 🎲 Pick n random questions
  const pickRandomQuestions = (n: number, pool: Question[]) => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  const handleStartGame = () => {
    if (allQuestions.length === 0) {
      alert('⚠️ No questions available. Please add some first.');
      return;
    }

    const n = Math.min(questionCount, allQuestions.length);
    const selected = pickRandomQuestions(n, allQuestions);
    setGameQuestions(selected);
    setRemainingTime(n * 60); // 🕒 1 minute per question
    setGameStarted(true);
    setTimeUp(false);
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  // ⏳ Timer countdown effect
  useEffect(() => {
    if (!gameStarted || timeUp || gameOver) return;

    const timer = setInterval(() => {
      setRemainingTime((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeUp, gameOver]);

  // 🖱️ Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartPos(position);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const dx = e.clientX - startMouse.x;
    const dy = e.clientY - startMouse.y;

    let newX = startPos.x + dx;
    let newY = startPos.y + dy;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaledWidth = containerWidth * zoom;
    const scaledHeight = containerHeight * zoom;

    const limitX = (scaledWidth - containerWidth) / 2 * 0.5;
    const limitY = (scaledHeight - containerHeight) / 2 * 0.5;

    newX = Math.min(limitX, Math.max(-limitX, newX));
    newY = Math.min(limitY, Math.max(-limitY, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // 🎯 Handle object click actions
  const handleClickAction = (action: string) => {
    if (action === 'question') setShowQuestion(true);
    if (action === 'hint') setShowHint(true);
    if (action === 'answer') setShowAnswer(true);
    if (action === 'if correct') {
      handleCheck();
      setCanShowAnswerObject(true);
    }
  };

  const handleCheck = () => {
    const q = gameQuestions[currentQuestionIndex];
    if (!q) return;

    const normalize = (s: string) => s.trim().toLowerCase();
    if (normalize(userAnswer) === normalize(q.answer)) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        setFeedback('');
        setUserAnswer('');
        setShowQuestion(false);
        setShowHint(false);
        setShowAnswer(false);
        setCanShowAnswerObject(false);
        if (currentQuestionIndex + 1 >= gameQuestions.length) setGameOver(true);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    } else setFeedback('❌ Wrong! Try again.');
  };

  const handleReset = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setShowQuestion(false);
    setShowHint(false);
    setShowAnswer(false);
    setFeedback('');
    setUserAnswer('');
    setCanShowAnswerObject(false);
    setGameOver(false);
    setTimeUp(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        {!gameStarted ? (
          <>
            <h1>Escape Room</h1>
            <p>Solve coding challenges before the timer runs out.</p>

            {/* 🧩 Game setup section */}
            <div className="mb-3">
              <label className="form-label fw-bold">Number of Questions:</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={allQuestions.length || 1}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Math.min(Math.max(Number(e.target.value), 1), allQuestions.length))
                }
                style={{ width: '150px' }}
                disabled={allQuestions.length === 0}
              />
              <small className="text-muted">
                Available questions: {allQuestions.length || 0}
              </small>
            </div>

            <div className="mb-3">
              <button
                className="btn btn-primary me-3"
                onClick={handleStartGame}
                disabled={allQuestions.length === 0}
              >
                Start Game
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowBuilder(!showBuilder)}
              >
                {showBuilder ? 'Hide Builder Room' : 'Open Builder Room'}
              </button>
            </div>

            {allQuestions.length === 0 && (
              <p className="text-danger">
                ⚠️ There are no questions yet. Please open the Builder Room to add some.
              </p>
            )}

            <hr />
            {showBuilder && <BuilderRoom onRefresh={fetchQuestions} />}
          </>
        ) : (
          <div
            className="position-relative w-100 overflow-hidden"
            style={{
              height: '80vh',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {/* Zoom Controls */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <button className="btn btn-sm btn-light" onClick={() => setZoom(Math.min(zoom + 0.1, 1.5))}>＋</button>
              <button className="btn btn-sm btn-light" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }}>⟳</button>
            </div>

            {/* Draggable, Zoomable Canvas */}
            <div
              className="hover-pan position-relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                width: '100%',
                height: '80vh',
                backgroundImage: 'url(/escape-room/escape-room-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <GameCanvas
                objects={objectsList}
                zoom={zoom}
                setZoom={setZoom}
                position={position}
                setPosition={setPosition}
                onClickAction={handleClickAction}
                remainingTime={remainingTime}
                canShowAnswerObject={canShowAnswerObject}
              />
              {!gameOver && !timeUp && showQuestion && gameQuestions[currentQuestionIndex] && (
                <GamePanel
                  question={gameQuestions[currentQuestionIndex]}
                  showQuestion={showQuestion}
                  showHint={showHint}
                  showAnswer={showAnswer}
                  feedback={feedback}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                />
              )}
              <OverlayEndScreen gameOver={gameOver} timeUp={timeUp} onReset={handleReset} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}