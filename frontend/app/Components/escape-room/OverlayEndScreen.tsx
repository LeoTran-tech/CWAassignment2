// assi2/frontend/app/Components/escape-room/OverlayEndScreen.tsx

// The OverlayEndScreen is a full-screen overlay that appears when
// the game ends, either by winning (gameOver) or losing (timeUp).
// It displays a message and a button to reset the game.

'use client';
interface Props {
    gameOver: boolean;
    timeUp: boolean;
    onReset: () => void;
}

export default function OverlayEndScreen({ gameOver, timeUp, onReset }: Props) {
    // Only show the overlay if the game is over (win or lose)
    if (!gameOver && !timeUp) return null;

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center position-absolute w-100 h-100"
            style={{ top: 0, left: 0, background: 'rgba(0,0,0,0.7)', color: '#fff' }}
        >
            {/* Result message */}
            <h2>
                {gameOver
                    ? 'Congratulations! You escaped the room!'
                    : 'Time is up! You are trapped in the room!'}
            </h2>

            {/* Reset game */}
            <button className="btn btn-light mt-3" onClick={onReset}>
                Return to Escape Room
            </button>
        </div>
    );
}
