interface StatusBadgeProps {
  text?: string;
}

export default function StatusBadge({
  text = "Open to ML / Data Science Roles",
}: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ff3131]/30 bg-[#ff3131]/10 px-3 py-1 text-[12px] font-medium tracking-tight text-[#ff3131] dark:text-[#ff4d4d] transition-colors">
      <span
        className="h-2 w-2 rounded-full bg-[#ff3131] animate-pulse"
        aria-hidden="true"
      />
      {text}
    </span>
  );
}
