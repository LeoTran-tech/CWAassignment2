// assi2/api/app/api/questions/route.tsx

// NextRequest, NextResponse are classes where their instances 
// represent the incoming request and outgoing response respectively.
import { NextRequest, NextResponse } from 'next/server';
import { Question, ensureConnection } from '../../lib/sequelize';

// CORS configuration to allow
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // any frontend to access the API
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',

    // When frontend sends JSON, it includes "Content-Type" header.
    // "Authorization" is included if frontend sends a token for authentication.
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight CORS requests from browsers
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET retrieves questions from the DB
export async function GET(request: NextRequest) {
    try {
        await ensureConnection();

        // retrieve optional topic query parameter
        const topic = request.nextUrl.searchParams.get('topic');

        // filter questions by topic
        const where = topic ? { where: { topic } } : {};
        const questions = await Question.findAll(where);

        return NextResponse.json(questions, { headers: corsHeaders });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}

// POST creates a new question in the DB
export async function POST(request: NextRequest) {
    try {
        await ensureConnection();

        // Retrieve fields from the request body
        const { topic, question, hint, answer } = await request.json();

        // If any field is missing, return a 400 Bad Request response
        if (!topic || !question || !hint || !answer) {
            return new NextResponse('All fields (topic, question, hint, answer) are required', { status: 400, headers: corsHeaders });
        }

        // Check for duplicate question before creating a new one
        const existing = await Question.findOne({ where: { question: question.trim() } });
        if (existing) {
            return NextResponse.json(
                { error: 'Duplicate question not allowed' },
                { status: 409, headers: corsHeaders }
            );
        }

        // Create and save the new question to the database and return it in the response
        const q = await Question.create({ topic, question, hint, answer });
        return NextResponse.json(q, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error(error);
        return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
    }
}