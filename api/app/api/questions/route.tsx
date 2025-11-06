// assi2/api/app/api/questions/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { Question, initDB } from '../../lib/sequelize';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
    try {
        await initDB(); // ✅ ensure DB + table ready

        const topic = request.nextUrl.searchParams.get('topic');
        const where = topic ? { where: { topic } } : {};
        const questions = await Question.findAll(where);
        return NextResponse.json(questions, { headers: corsHeaders });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}

export async function POST(request: NextRequest) {
    try {
        await initDB(); // ✅ ensure DB ready first

        const { topic, question, hint, answer } = await request.json();

        if (!topic || !question || !hint || !answer) {
            return new NextResponse('All fields (topic, question, hint, answer) are required', { status: 400, headers: corsHeaders });
        }

        const existing = await Question.findOne({ where: { question: question.trim() } });
        if (existing) {
            return NextResponse.json(
                { error: 'Duplicate question not allowed' },
                { status: 409, headers: corsHeaders }
            );
        }

        const q = await Question.create({ topic, question, hint, answer });
        return NextResponse.json(q, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error(error);
        return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
    }
}