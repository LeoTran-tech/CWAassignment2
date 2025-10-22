// assi2/frontend/app/Components/escape-room/BuilderRoom.tsx
'use client';
import { useState, useEffect } from 'react';
import { Question } from './types';

const APIURL = 'http://ec2-3-85-115-208.compute-1.amazonaws.com:4080';

interface Props {
    onRefresh?: () => void; // optional callback to refresh parent
}

export default function BuilderRoom({ onRefresh }: Props) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newTopic, setNewTopic] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [newHint, setNewHint] = useState('');

    const fetchQuestions = async () => {
        const res = await fetch(`${APIURL}/api/questions`);
        if (res.ok) setQuestions(await res.json());
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAdd = async () => {
        if (!newTopic || !newQuestion || !newAnswer || !newHint) {
            alert('All fields are required.');
            return;
        }

        const res = await fetch(`${APIURL}/api/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: newTopic.trim(),
                question: newQuestion.trim(),
                answer: newAnswer.trim(),
                hint: newHint.trim(),
            }),
        });

        if (res.ok) {
            alert(`✅ Added new question to "${newTopic}"`);
            setNewTopic('');
            setNewQuestion('');
            setNewAnswer('');
            setNewHint('');
            await fetchQuestions();
            onRefresh?.(); // notify parent
        }
    };

    return (
        <div>
            <h2>Builder Room</h2>

            {/* Add form */}
            <div className="mb-3 row">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Topic"
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Question"
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newHint}
                        onChange={(e) => setNewHint(e.target.value)}
                        placeholder="Hint"
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Answer"
                    />
                </div>
            </div>
            <button className="btn btn-success mb-4" onClick={handleAdd}>
                Add Question
            </button>

            {/* Display Table */}
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Topic</th>
                        <th>Question</th>
                        <th>Hint</th>
                        <th>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map((q, idx) => (
                            <tr key={q.id ?? idx}>
                                <td>{idx + 1}</td>
                                <td>{q.topic}</td>
                                <td>{q.question}</td>
                                <td>{q.hint}</td>
                                <td>{q.answer}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">
                                No questions yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
