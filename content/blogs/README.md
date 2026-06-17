# 📝 How to Add New Blogs

This portfolio supports **two ways** to display blog posts. You can use either or both.

---

## Option 1: Write on Dev.to (Easiest — Recommended)

Your portfolio already auto-fetches articles from your Dev.to account: [`dev.to/javeedishaq`](https://dev.to/javeedishaq).

**To add a new blog:**
1. Go to [dev.to](https://dev.to) and write/publish a new article
2. That's it — your portfolio will automatically pull it in within ~1 hour (cached)
3. No code changes needed. No rebuild needed.

> ✅ **Pros:** Zero maintenance, automatic reading time, SEO optimized, comments built-in  
> ⚠️ **Cons:** You can't fully customize the layout

---

## Option 2: Write a Local Markdown Blog (Full Control)

For fully custom blog posts with your own styling, create a Markdown file.

### Step 1: Create the Markdown file

Create a new file in `content/blogs/` with a URL-friendly filename. For example:

```
content/blogs/my-awesome-flutter-tip.md
```

### Step 2: Add frontmatter (metadata at the top)

Every blog file **must** start with this YAML frontmatter block between `---`:

```markdown
---
title: "My Awesome Flutter Tip"
date: "2026-06-17"
description: "A short summary of what this blog post is about."
tags: ["Flutter", "Dart", "Mobile"]
coverImage: "/blogs/my-cover.png"
featured: true
readingTime: 5
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Blog post title |
| `date` | ✅ | Publish date (`YYYY-MM-DD` format) |
| `description` | ✅ | Short summary for cards and SEO |
| `tags` | ✅ | Array of tags (shown as badges) |
| `coverImage` | ❌ | Hero image path (place image in `public/blogs/`) |
| `featured` | ❌ | Set to `true` to pin it in featured sections |
| `readingTime` | ❌ | Minutes to read (or auto-calculated from word count) |

### Step 3: Write your content

After the frontmatter, write your blog content in Markdown:

```markdown
---
title: "My Awesome Flutter Tip"
date: "2026-06-17"
description: "A short summary..."
tags: ["Flutter", "Dart", "Mobile"]
coverImage: "/blogs/my-cover.png"
featured: true
readingTime: 5
---

## Introduction

Write your blog post here using standard **Markdown** syntax.

### You can use:

- Bullet lists
- **Bold** and *italic* text
- `inline code`
- Code blocks:

```dart
void main() {
  print('Hello, Flutter!');
}
```

- Tables:

| Feature | Supported |
|---------|-----------|
| Tables | ✅ |
| Links | ✅ |
| Images | ✅ |

> Blockquotes work too!
```

### Step 4: Add a cover image (optional)

If you use `coverImage` in frontmatter, place the image in `public/blogs/`:

```
public/blogs/my-cover.png
```

Then reference it as:

```yaml
coverImage: "/blogs/my-cover.png"
```

### Step 5: Restart the dev server

The blog system reads files at build time. If running locally, restart:

```bash
npm run dev   # or pnpm dev
```

Then visit: `http://localhost:3000/blogs`

---

## How It All Works Together

```
┌─────────────────┐     ┌────────────────────┐
│  Local Markdown │     │   Dev.to Articles  │
│  (content/blogs)│     │  (dev.to/javeed...)│
└────────┬────────┘     └──────────┬─────────┘
         │                         │
         └───────────┬─────────────┘
                     │
              ┌──────▼──────┐
              │ /blogs page │
              └─────────────┘
```

- Local blogs + Dev.to articles are merged and sorted by date
- They appear together in a grid on `/blogs`
- Each blog has its own page at `/blogs/your-slug`

---

## Quick Example: Complete Blog File

Create `content/blogs/why-i-love-nestjs.md`:

```markdown
---
title: "Why I Love NestJS for Backend Development"
date: "2026-06-17"
description: "After 2 years of building APIs with NestJS, here's why I think it's the best Node.js framework for production."
tags: ["NestJS", "Node.js", "Backend", "TypeScript"]
coverImage: "/blogs/nestjs-hero.png"
featured: true
readingTime: 8
---

## The Problem with Express

Express is great for small projects, but as your API grows...

## Enter NestJS

NestJS brings structure, decorators, and dependency injection to Node.js.

## Conclusion

If you're building a serious backend in 2026, give NestJS a try.
```

And place the cover image at `public/blogs/nestjs-hero.png`.

---

## File Naming Tips

- Use lowercase, hyphens, and no spaces: `my-blog-post.md` ✅
- Avoid special characters: `my blog!?.md` ❌
- The filename becomes the URL slug: `/blogs/my-blog-post`

---

## Need Help?

- The blog system uses `gray-matter` for frontmatter parsing
- Markdown is processed with `remark` + `remark-gfm` + `remark-html`
- Check existing Dev.to articles for topic inspiration
