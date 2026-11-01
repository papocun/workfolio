/** Small chessboard thumbnail for the Chess.com hover preview. */
export default function ChessPreviewThumb() {
  const rows = 4;
  const cols = 8;
  const w = 224 / cols;
  const h = 104 / rows;
  return (
    <svg viewBox="0 0 224 104" className="size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const dark = (r + c) % 2 === 1;
        return (
          <rect
            key={i}
            x={c * w}
            y={r * h}
            width={w}
            height={h}
            className={dark ? 'fill-[#769656]' : 'fill-[#eeeed2]'}
          />
        );
      })}
      <text x={w * 2.5} y={h * 1.5} textAnchor="middle" dominantBaseline="central" fontSize="30" className="fill-slate-900">
        ♞
      </text>
      <text x={w * 5.5} y={h * 2.5} textAnchor="middle" dominantBaseline="central" fontSize="30" className="fill-white" stroke="#1e293b" strokeWidth="0.8">
        ♚
      </text>
    </svg>
  );
}
