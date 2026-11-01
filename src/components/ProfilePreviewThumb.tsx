import { getAssetPath } from '@/lib/assetPath';

/** Hover-preview thumbnail for a coding profile: avatar on a tinted backdrop. */
export default function ProfilePreviewThumb({
  src,
  alt,
  tint,
}: {
  src: string;
  alt: string;
  tint: string;
}) {
  return (
    <span className="flex size-full items-center justify-center" style={{ background: tint }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src.startsWith('http') ? src : getAssetPath(src)}
        alt={alt}
        width={64}
        height={64}
        className="size-16 rounded-xl object-cover shadow-md"
        draggable={false}
      />
    </span>
  );
}
