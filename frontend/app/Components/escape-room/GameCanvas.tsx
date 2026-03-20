// assi2/frontend/app/Components/escape-room/GameCanvas.tsx

// The GameCanvas is the main interactive area of the escape room
// game, NOT the escape room tab. It displays interactive objects, and
// handles user interactions like panning and clicking on objects.
// It is shown when the user enter the gameplay from the "Escape Room"
// tab.

'use client';
import { useState } from 'react';
import TimerBadge from './TimerBadge';
import { ObjectItem } from './types';

// Props defines the expected properties for the GameCanvas
interface Props {
    objects: ObjectItem[]; // list of interactive objects in the game
    zoom: number; // current zoom level of the canvas
    setZoom: (z: number) => void; // function to update the zoom level
    position: { x: number; y: number }; // current position of the canvas (for panning)
    setPosition: (p: { x: number; y: number }) => void; // function to update the canvas position
    onClickAction: (action: string) => void; // function to handle click actions on objects
    remainingTime: number; // remaining time in seconds for the game
    canShowAnswerObject: boolean; // flag to determine if the answer object can be shown (based on game state)
}

export default function GameCanvas({
    objects,
    zoom,
    setZoom,
    position,
    setPosition,
    onClickAction,
    remainingTime,
    canShowAnswerObject,
}: Props) {
    // --- LOCAL STATE FOR INTERACTION ---
    // isDragging tracks whether the user is currently dragging the canvas for panning
    const [isDragging, setIsDragging] = useState(false);
    // startMouse stores the initial mouse position when dragging starts
    const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
    // startPos stores the initial canvas position when dragging starts
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // --- DRAG HANDLERS ---
    // handleMouseDown initializes dragging state and stores starting positions
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartMouse({ x: e.clientX, y: e.clientY });
        setStartPos(position);
    };

    // handleMouseMove updates the canvas position based on mouse movement while dragging
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - startMouse.x;
        const dy = e.clientY - startMouse.y;
        setPosition({ x: startPos.x + dx, y: startPos.y + dy });
    };

    // --- RENDER ---
    return (
        <div
            className="hover-pan"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            style={{
                width: '100%',
                height: '80vh',
                backgroundImage: 'url(/escape-room/escape-room-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',

                // Apply zoom + pan transformation
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center center',

                // Change cursor style based on dragging state
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
        >
            <TimerBadge remainingTime={remainingTime} />

            {/* --- RENDER INTERACTIVE OBJECTS --- */}
            {objects.map((obj, idx) => {

                // Hide the answer object if the game state does not allow it to be shown yet
                if (obj.action === 'answer' && !canShowAnswerObject) return null;
                return (
                    <div
                        key={idx}
                        className="d-flex align-items-center"
                        style={{
                            position: 'absolute',
                            top: `${10 + idx * 20}%`,
                            left: '10%',
                            cursor: 'pointer',
                        }}
                        onClick={() => onClickAction(obj.action)}
                    >
                        {/* Object icon */}
                        <img
                            src={obj.src}
                            alt={obj.action}
                            style={{ width: '80px', marginRight: '10px' }} />

                        {/* Action label */}
                        <span className="badge bg-secondary">
                            Reveal {obj.action}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
