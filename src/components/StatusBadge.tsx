interface StatusBadgeProps {
  text?: string;
}

export default function StatusBadge({
  text = "Open to ML / Data Science Roles",
}: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#00BA7C]/30 bg-[#00BA7C]/10 px-3 py-1 text-[12px] font-medium tracking-tight text-[#00BA7C] dark:text-[#00BA7C] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <span
        className="h-2 w-2 rounded-full bg-[#00BA7C] animate-pulse"
        aria-hidden="true"
      />
      {text}
    </span>
  );
}
