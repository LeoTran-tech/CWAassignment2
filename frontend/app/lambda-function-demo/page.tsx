// app/lambda-function-demo/page.tsx

// This page demonstrates fetching data from an AWS Lambda Function URL and display it.

"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Nav from '../Components/Navbar';

type Question = {
    topic: string;
    question: string;
    hint: string;
    answer: string;
};

const LAMBDA_URL =
    "https://brj6ie7pn3lwq2fz6lhpuf6tpq0cwcdo.lambda-url.ap-southeast-2.on.aws/";

export default function LambdaFunctionDemo() {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("Calling Lambda URL:", LAMBDA_URL);

        // Fetch data
        fetch(LAMBDA_URL)
            .then(async (res) => {
                // Log the raw response status and text for debuggin
                console.log("HTTP status:", res.status);

                // Read the response as text first to see the raw output
                const text = await res.text();
                console.log("Raw response text:", text);

                // Check if the response is OK
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                // Try to parse the text as JSON
                const data = JSON.parse(text);
                console.log("Parsed data:", data);

                // Update state with the fetched questions
                setQuestions(data.questions || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch failed:", err);
                setError("Could not load questions from Lambda.");
                setLoading(false);
            });
    }, []);

    return (
        <main>
            <Nav />
            <h1>Lambda Demo Page</h1>
            <p>This page fetches question data from an AWS Lambda Function URL.</p>

            <p>Questions count: {questions.length}</p>

            {loading && <p>Loading questions...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <div>
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            style={{
                                border: "2px solid black",
                                borderRadius: "8px",
                                padding: "16px",
                                marginBottom: "16px",
                                background: "#fff",
                                color: "#000"
                            }}
                        >
                            <h3>{q.topic}</h3>
                            <p><strong>Question:</strong> {q.question}</p>
                            <p><strong>Hint:</strong> {q.hint}</p>
                            <p><strong>Answer:</strong> {q.answer}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
