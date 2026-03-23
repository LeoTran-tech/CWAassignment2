// assi2/frontend/app/Components/escape-room/GamePanel.tsx

// The GamePanel is shown when user clicks the ball object. Its purpose
// is to display the current question, accept user input for the answer,
// and show hints/feedback/answer based on the game state.

'use client';
import { Question } from './types';

// Props defines the expected properties for the GamePanel component
interface Props {
    question: Question; // the current question to display
    showQuestion: boolean; // flag to determine if the question should be shown
    showHint: boolean; // flag to determine if the hint should be shown
    showAnswer: boolean; // flag to determine if the answer should be shown
    feedback: string; // user feedback message
    userAnswer: string; // the user's current answer
    setUserAnswer: (v: string) => void; // function to update the user's answer
}

// GamePanel component definition
export default function GamePanel({
    question,
    showQuestion,
    showHint,
    showAnswer,
    feedback,
    userAnswer,
    setUserAnswer,
}: Props) {
    return (
        <div
            className="card text-dark p-3 position-absolute"
            style={{ top: '15%', left: '35%', maxWidth: '50%' }}
        >
            {/* Instruction */}
            <p>
                When the box disappears, click the ball again to reveal the next question.
            </p>

            {/* Question */}
            {showQuestion && <h3>{question.question}</h3>}

            {/* Text area for user input */}
            <textarea
                className="form-control my-2"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={5}
                style={{ resize: 'both' }}
            />

            {/* Hint */}
            {showHint && <p className="text-warning">{question.hint}</p>}

            {/* Feedback (correct / wrong) */}
            {feedback && <p className="mt-2">{feedback}</p>}

            {/* Answer */}
            {showAnswer && <p className="text-success">{question.answer}</p>}
        </div>
    );
}
