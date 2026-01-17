# Portfolio Image Assets Directory

You can place your project screenshots, code diagrams, and blog banners in their respective folders below.

## Folder Organization

- **Projects:** `public/images/projects/`
  - *Usage in code:* `/images/projects/your-image.png` (or `.jpg`, `.webp`, `.svg`)
  - *Example:* `/images/projects/customer-segmentation.png`

- **Code / Problem Solving:** `public/images/code/`
  - *Usage in code:* `/images/code/your-image.png`
  - *Example:* `/images/code/leetcode-stats.png`

- **Blog / Field Notes:** `public/images/blog/`
  - *Usage in code:* `/images/blog/your-image.png`
  - *Example:* `/images/blog/query-optimization-benchmark.png`

---

## How to use them in Next.js

In any component or page, reference the image path starting with `/images/...`:

```tsx
import Image from 'next/image';

// Example inside a project or blog card:
<Image
  src="/images/projects/customer-segmentation.png"
  alt="Customer Segmentation API Architecture"
  width={600}
  height={340}
  className="rounded-lg object-cover"
/>
```
