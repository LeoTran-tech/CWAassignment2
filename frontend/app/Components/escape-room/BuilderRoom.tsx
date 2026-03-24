// assi2/frontend/app/Components/escape-room/BuilderRoom.tsx

// The BuilderRoom is shown when the user clicks "Open Builder Room" button in
// the Escape Room tab. It allows users to create, read, update, and delete questions
// that will be used in the escape room game. It interacts with the backend API.

'use client';
import { useState, useEffect } from 'react';
import { Question } from './types';

const APIURL = 'http://ec2-13-239-184-83.ap-southeast-2.compute.amazonaws.com:4080';

interface Props {
    onRefresh?: () => void;
}

export default function BuilderRoom({ onRefresh }: Props) {
    // --- STATE VARIABLES ---

    // List of questions fetched from the backend
    const [questions, setQuestions] = useState<Question[]>([]);
    // track which question is being edited

    const [editingId, setEditingId] = useState<number | null>(null);
    const [newTopic, setNewTopic] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [newHint, setNewHint] = useState('');

    // --- FETCH QUESTIONS ---
    // Fetch all questions from backend api
    const fetchQuestions = async () => {
        const res = await fetch(`${APIURL}/api/questions`);
        if (res.ok) setQuestions(await res.json());
    };

    // whenever user enters the Builder Room, fetch the questions
    useEffect(() => {
        fetchQuestions();
    }, []);

    // --- CRUD OPERATIONS ---
    // Add new question
    const handleAdd = async () => {
        // Prevent adding if any field is empty
        if (!newTopic || !newQuestion || !newAnswer || !newHint) {
            alert('All fields are required.');
            return;
        }

        // Create new question via POST request
        const res = await fetch(`${APIURL}/api/questions`, { // use fetch function 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ // Convert object JS to JSON string
                topic: newTopic.trim(),
                question: newQuestion.trim(),
                answer: newAnswer.trim(),
                hint: newHint.trim(),
            }),
        });

        // If successfully added, reset form and refresh question list
        if (res.ok) {
            resetForm();
            await fetchQuestions();
        }
    };

    // Update question
    const handleUpdate = async (id: number) => {
        const res = await fetch(`${APIURL}/api/questions/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: newTopic.trim(),
                question: newQuestion.trim(),
                answer: newAnswer.trim(),
                hint: newHint.trim(),
            }),
        });

        if (res.ok) {
            resetForm();
            setEditingId(null);
            await fetchQuestions();
        }
    };

    // Delete question
    const handleDelete = async (id: number) => {
        const res = await fetch(`${APIURL}/api/questions/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            // Re-fetch updated question list
            await fetchQuestions();
        }
    };

    // --- EDITING LOGIC ---
    // When user clicks "Edit", populate form with question data and set editingId
    const startEditing = (q: Question) => {
        setEditingId(q.id!);
        setNewTopic(q.topic);
        setNewQuestion(q.question);
        setNewHint(q.hint);
        setNewAnswer(q.answer);
    };

    // --- FORM RESET ---
    // Clear form fields and reset editing state
    const resetForm = () => {
        setNewTopic('');
        setNewQuestion('');
        setNewAnswer('');
        setNewHint('');
        setEditingId(null);
    };

    // --- RENDER ---
    return (
        <div>
            <h2>Builder Room</h2>
            <h3>Warning: No 2 questions in the &quot;Question&quot; column can be the same!</h3>

            {/* --- FORM SECTION (CREADTE/UPDATE) ---*/}
            <div className="mb-3 row">
                {/*Topic field*/}
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Topic"
                    />
                </div>

                {/* Question field */}
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Question"
                    />
                </div>

                {/* Hint field */}
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newHint}
                        onChange={(e) => setNewHint(e.target.value)}
                        placeholder="Hint"
                    />
                </div>

                {/* Answer field */}
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

            {/* Action Buttons (Add vs Update mode)*/}
            <div className="mb-3">
                {editingId ? (
                    <>
                        <button
                            className="btn btn-warning me-2"
                            onClick={() => handleUpdate(editingId)}
                        >
                            Update
                        </button>
                        <button className="btn btn-secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="btn btn-success" onClick={handleAdd}>
                        Add Question
                    </button>
                )}
            </div>

            {/* --- TABLE DISPLAY --- */}
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Topic</th>
                        <th>Question</th>
                        <th>Hint</th>
                        <th>Answer</th>
                        <th>Actions</th>
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
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => startEditing(q)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(q.id!)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">
                                No questions yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
