// assi2/frontend/app/Components/escape-room/GameCanvas.tsx
'use client';
import { useState } from 'react';
import TimerBadge from './TimerBadge';
import { ObjectItem } from './types';

interface Props {
    objects: ObjectItem[];
    zoom: number;
    setZoom: (z: number) => void;
    position: { x: number; y: number };
    setPosition: (p: { x: number; y: number }) => void;
    onClickAction: (action: string) => void;
    remainingTime: number;
    canShowAnswerObject: boolean;
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
    const [isDragging, setIsDragging] = useState(false);
    const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartMouse({ x: e.clientX, y: e.clientY });
        setStartPos(position);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - startMouse.x;
        const dy = e.clientY - startMouse.y;
        setPosition({ x: startPos.x + dx, y: startPos.y + dy });
    };

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
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
        >
            <TimerBadge remainingTime={remainingTime} />

            {objects.map((obj, idx) => {
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
                        <img src={obj.src} alt={obj.action} style={{ width: '80px', marginRight: '10px' }} />
                        <span className="badge bg-secondary">Reveal {obj.action}</span>
                    </div>
                );
            })}
        </div>
    );
}
