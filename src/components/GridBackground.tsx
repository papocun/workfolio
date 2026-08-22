export default function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 48px x 48px Dashed Grid with 30% increased opacity + Smooth Vertical Fade */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 48 0 L 0 0 0 48' fill='none' stroke='rgba(255,255,255,0.176)' stroke-width='1' stroke-dasharray='2 3'/%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 52%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 52%)',
        }}
      />
    </div>
  );
}
