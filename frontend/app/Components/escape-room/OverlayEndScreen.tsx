// assi2/frontend/app/Components/escape-room/OverlayEndScreen.tsx
'use client';
interface Props {
    gameOver: boolean;
    timeUp: boolean;
    onReset: () => void;
}

export default function OverlayEndScreen({ gameOver, timeUp, onReset }: Props) {
    if (!gameOver && !timeUp) return null;

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center position-absolute w-100 h-100"
            style={{ top: 0, left: 0, background: 'rgba(0,0,0,0.7)', color: '#fff' }}
        >
            <h2>{gameOver ? 'Congratulations! You escaped the room!' : 'Time is up! You are trapped in the room!'}</h2>
            <button className="btn btn-light mt-3" onClick={onReset}>
                Return to Escape Room
            </button>
        </div>
    );
}
