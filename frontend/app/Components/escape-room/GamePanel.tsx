// assi2/frontend/app/Components/escape-room/GamePanel.tsx
'use client';
import { Question } from './types';

interface Props {
    question: Question;
    showQuestion: boolean;
    showHint: boolean;
    showAnswer: boolean;
    feedback: string;
    userAnswer: string;
    setUserAnswer: (v: string) => void;
}

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
            <p>When the box disappears, click the ball again to reveal the next question.</p>
            {showQuestion && <h3>{question.question}</h3>}
            <textarea
                className="form-control my-2"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={5}
                style={{ resize: 'both' }}
            />
            {showHint && <p className="text-warning">{question.hint}</p>}
            {feedback && <p className="mt-2">{feedback}</p>}
            {showAnswer && <p className="text-success">{question.answer}</p>}
        </div>
    );
}
