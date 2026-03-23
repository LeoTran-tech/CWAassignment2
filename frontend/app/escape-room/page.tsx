// assi2/frontend/app/escape-room/page.tsx

// The Escape Room tab allows users to set the number of questions,
// start an escape room game, play the game, and open the builder room.
// It includes fetching questions, handles game logic, and renders the
// main game canvas and UI.

'use client';
import { useEffect, useState } from 'react';
import Nav from '../Components/Navbar';
import BuilderRoom from '../Components/escape-room/BuilderRoom';
import GameCanvas from '../Components/escape-room/GameCanvas';
import GamePanel from '../Components/escape-room/GamePanel';
import OverlayEndScreen from '../Components/escape-room/OverlayEndScreen';
import { Question, ObjectItem } from '../Components/escape-room/types';

const APIURL = 'http://ec2-16-176-227-155.ap-southeast-2.compute.amazonaws.com:4080';

export default function EscapeRoom() {

  // --- STATE MANAGEMENT ---
  // Question data
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // all questions in the database
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]); // questions selected for current game
  const [questionCount, setQuestionCount] = useState(1); // number of questions to play with

  // Game flow state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  // UI toggles
  const [showBuilder, setShowBuilder] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Gameplay state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [canShowAnswerObject, setCanShowAnswerObject] = useState(false);

  // Canvas interaction state, handling zoom and dragging
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Timer
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // --- STATIC GAME OBJECTS ---
  // Defines interactive objects in the escape room, each triggers a different action
  const objectsList: ObjectItem[] = [
    { src: '/escape-room/objects-for-coding-challenges/football.svg', action: 'question' },
    { src: '/escape-room/objects-for-coding-challenges/shirt.svg', action: 'hint' },
    { src: '/escape-room/objects-for-coding-challenges/baseball.svg', action: 'if correct' },
    { src: '/escape-room/objects-for-coding-challenges/computer.svg', action: 'answer' },
  ];

  // --- DATA FETCHING ---
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${APIURL}/api/questions`);
      if (res.ok) {
        const data = await res.json();
        setAllQuestions(data);

        // Reset question count if data exists, otherwise it will be stuck at 1
        if (data.length > 0) setQuestionCount(1);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  // Load questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // --- GAME SETUP ---
  // Pick n random questions
  const pickRandomQuestions = (n: number, pool: Question[]) => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Function to start game
  const handleStartGame = () => {
    if (allQuestions.length === 0) {
      alert('No questions available. Please add some first.');
      return;
    }

    // Select random questions for the game
    const n = Math.min(questionCount, allQuestions.length);
    const selected = pickRandomQuestions(n, allQuestions);
    setGameQuestions(selected);
    setRemainingTime(n * 60); // 1 minute per question
    setGameStarted(true);
    setTimeUp(false);

    // Reset camera to default when starting a new game
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  // --- TIMER LOGIC ---
  // Timer countdown effect
  useEffect(() => {
    // Don't start timer if game hasn't started, or if time is up or game is over
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

  // --- CANVAS INTERACTION LOGIC ---
  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);

    // x, y are the coordinates of the mouse when dragging starts
    setStartMouse({ x: e.clientX, y: e.clientY });

    // startPos stores the initial position of the canvas when dragging starts
    setStartPos(position);
  };

  // Handle mouse move for dragging,
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // if the user is not dragging, do nothing
    if (!isDragging) return;

    // Get the container element to calculate boundaries for dragging
    const container = e.currentTarget.parentElement;
    // If container is not found, do nothing (should not happen)
    if (!container) return;

    // dx, dy are the distances the mouse has moved since dragging started
    // along the x and y axes, respectively
    const dx = e.clientX - startMouse.x;
    const dy = e.clientY - startMouse.y;

    // Calculate new position based on mouse movement and initial position
    // when dragging started
    let newX = startPos.x + dx;
    let newY = startPos.y + dy;

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate the scaled dimensions of the canvas based on the current zoom level
    const scaledWidth = containerWidth * zoom;
    const scaledHeight = containerHeight * zoom;

    // Calculate limits for dragging to prevent the canvas from being dragged too far
    const limitX = (scaledWidth - containerWidth) / 2 * 0.5;
    const limitY = (scaledHeight - containerHeight) / 2 * 0.5;

    // Constrain newX and newY within the calculated limits to prevent dragging too far
    newX = Math.min(limitX, Math.max(-limitX, newX));
    newY = Math.min(limitY, Math.max(-limitY, newY));

    // when the user drags the canvas, update the position of the 
    // canvas by the distance the mouse has moved since dragging started
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- GAME INTERACTIONS ---
  // Handle object click actions
  const handleClickAction = (action: string) => {
    if (action === 'question') setShowQuestion(true);
    if (action === 'hint') setShowHint(true);
    if (action === 'answer') setShowAnswer(true);
    if (action === 'if correct') {
      handleCheck();
      setCanShowAnswerObject(true);
    }
  };

  // Check if user's answer is correct, and provide feedback
  const handleCheck = () => {
    const q = gameQuestions[currentQuestionIndex];
    if (!q) return;

    // Normalize function to compare answers case-insensitively and ignoring extra spaces
    const normalize = (s: string) => s.trim().toLowerCase();

    if (normalize(userAnswer) === normalize(q.answer)) {
      setFeedback('Correct!');

      // After a short delay, move to the next question or end game if it was the last question
      setTimeout(() => {
        // Reset UI for next question
        setFeedback('');
        setUserAnswer('');
        setShowQuestion(false);
        setShowHint(false);
        setShowAnswer(false);
        setCanShowAnswerObject(false);

        // If there are no more questions left, end the game with a win
        if (currentQuestionIndex + 1 >= gameQuestions.length) {
          setGameOver(true);
        } else {
          // Otherwise, move to the next question
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 1000);
    } else setFeedback('Wrong! Try again.');
  };

  // --- GAME RESET ---
  // Reset all game state to initial values. This happens when the
  // user clicks "Return to Escape Room" button on the end screen
  // overlay, allowing them to start a new game or open the builder
  // room again without refreshing the page.
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

  // -- RENDER ---
  return (
    <div>
      <Nav />
      <div className="container mt-4">

        {/* When the game has not started, show the setup screen*/}
        {!gameStarted ? (
          <>
            <h1>Escape Room</h1>
            <p>Solve coding challenges before the timer runs out.</p>

            {/* Section to configure number of questions */}
            <div className="mb-3">
              <label className="form-label fw-bold">Number of Questions:</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={allQuestions.length}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Math.min(Math.max(Number(e.target.value), 1), allQuestions.length))
                }
                style={{ width: '150px' }}
                disabled={allQuestions.length === 0}
              />
            </div>

            {/* Start game / toggle builder */}
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

            {/* Show warning if no questions exist */}
            {allQuestions.length === 0 && (
              <p className="text-danger">
                There are no questions yet. Please open the Builder Room to add some.
              </p>
            )}

            {/* Builder Room for creating/editing questions */}
            <hr />
            {showBuilder && <BuilderRoom onRefresh={fetchQuestions} />}
          </>
        ) : (
          <>
            {/* When the game has started, display the game screen */}
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
          </>
        )}
      </div>
    </div>
  );
}