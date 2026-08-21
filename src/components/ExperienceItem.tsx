import type { Experience } from "@/types";

interface ExperienceItemProps {
  experience: Experience;
}

/**
 * Highlights numbers/percentages within highlight text by wrapping them
 * in a <strong> tag.
 */
function highlightNumbers(text: string): React.ReactNode {
  const parts = text.split(/(~?\d[\d,.]*%?(?:\+|ms|px|s|x)?)/g);
  return parts.map((part, i) => {
    if (/^~?\d[\d,.]*%?(?:\+|ms|px|s|x)?$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-slate-800">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <article className="relative border-l-2 border-slate-200 py-1 pl-6">
      {/* Timeline dot */}
      <span
        className="absolute -left-[5px] top-2.5 h-2 w-2 rounded-full border-2 border-slate-300 bg-white"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-3">
        <h3 className="text-[16px] font-semibold leading-[1.35] text-slate-900 sm:text-[18px]">
          {experience.role}
        </h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[14px] font-medium text-slate-700">
            {experience.company}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-[13px] text-slate-500 font-medium">
            {experience.period}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-[13px] text-slate-500">
            {experience.location}
          </span>
        </div>
      </div>

      {/* Highlight bullets */}
      <ul className="mb-4 space-y-2">
        {experience.highlights.map((highlight, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-[14px] leading-[1.6] text-slate-600 sm:text-[15px]"
          >
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400"
              aria-hidden="true"
            />
            <span>{highlightNumbers(highlight)}</span>
          </li>
        ))}
      </ul>

      {/* Technology badges */}
      <div className="flex flex-wrap gap-1.5">
        {experience.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-[11.5px] font-medium tracking-tight text-slate-700"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
