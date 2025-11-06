// assi2/api/app/api/questions/[id]/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { Question, initDB } from '../../../lib/sequelize';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ Preflight handler
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// ✅ PATCH /api/questions/[id]
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // 👈 params is a Promise now
) {
    try {
        await initDB();
        const { id } = await context.params; // ✅ must await

        const body = await request.json();

        if (body.question) {
            const existing = await Question.findOne({ where: { question: body.question.trim() } });

            if (existing && existing.id.toString() !== id) {
                return NextResponse.json(
                    { error: 'Duplicate question not allowed' },
                    { status: 409, headers: corsHeaders }
                );
            }
        }

        const [updated] = await Question.update(body, { where: { id } });

        if (!updated)
            return new NextResponse('Question not found', { status: 404, headers: corsHeaders });

        return new NextResponse('✅ Question updated successfully', {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}

// ✅ DELETE /api/questions/[id]
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // 👈 same here
) {
    try {
        await initDB();
        const { id } = await context.params; // ✅ must await

        const deleted = await Question.destroy({ where: { id } });

        if (!deleted)
            return new NextResponse('Question not found', { status: 404, headers: corsHeaders });

        return new NextResponse('🗑️ Question deleted successfully', {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}