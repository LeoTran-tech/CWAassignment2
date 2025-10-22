// assi2/frontend/app/Components/escape-room/TimerBadge.tsx
'use client';
interface Props {
    remainingTime: number;
}

export default function TimerBadge({ remainingTime }: Props) {
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60)
            .toString()
            .padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
            }}
        >
            <span className="badge bg-danger fs-5">{formatTime(remainingTime)}</span>
        </div>
    );
}
