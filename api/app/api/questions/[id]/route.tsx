// assi2/api/app/api/questions/[id]/route.tsx

import { NextRequest, NextResponse } from 'next/server';
import { Question, ensureConnection } from '../../../lib/sequelize';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Preflight handler
export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// PATCH /api/questions/[id]
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureConnection();
        // Extract the question ID that needs to be updated
        const { id } = await context.params;

        // Get the fields to update from the request body
        const body = await request.json();

        // if question text is being updated, check for duplicates before allowing the update
        if (body.question) {
            const existing = await Question.findOne({ where: { question: body.question.trim() } });

            if (existing && existing.id.toString() !== id) {
                return NextResponse.json(
                    { error: 'Duplicate question not allowed' },
                    { status: 409, headers: corsHeaders }
                );
            }
        }

        // Update the question with the given ID using the provided fields
        const [updated] = await Question.update(body, { where: { id } });

        // If no rows were updated, the question with the given ID was not found
        if (!updated)
            return new NextResponse('Question not found', { status: 404, headers: corsHeaders });

        return new NextResponse('Question updated successfully', {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/questions/[id]
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureConnection();
        // Extract the question ID
        const { id } = await context.params;

        // Delete the question with the given ID from the database
        const deleted = await Question.destroy({ where: { id } });

        // If no rows were deleted, the question with the given ID was not found
        if (!deleted)
            return new NextResponse('Question not found', { status: 404, headers: corsHeaders });

        return new NextResponse('Question deleted successfully', {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Server error', { status: 500, headers: corsHeaders });
    }
}