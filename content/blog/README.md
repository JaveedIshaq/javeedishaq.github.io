# Blog posts

Each `.md` file in this folder becomes a page at `/blogs/<file-name>`.
Your dev.to articles are added to the blog list automatically at build time.

## Write a new post

1. Copy `_template.md` to `my-post-slug.md` (the file name becomes the URL).
2. Fill in the frontmatter and write the post in Markdown.
3. Preview with `npm run dev` → http://localhost:3000/blogs/my-post-slug
4. Set `draft: false`, commit, then run `./deploy.sh`.

## Frontmatter

| Field         | Required | Notes                                                        |
|---------------|----------|--------------------------------------------------------------|
| `title`       | yes      |                                                              |
| `description` | yes      | One sentence. Used on cards and for SEO.                     |
| `date`        | yes      | `YYYY-MM-DD`                                                  |
| `tags`        | no       | e.g. `["flutter", "dart"]`                                    |
| `topic`       | no       | One of `AI`, `Flutter`, `Mobile`, `Backend`, `Web`, `Career`. Worked out from tags if missing. |
| `featured`    | no       | `true` shows it as the big card on top of /blogs.             |
| `cover`       | no       | Image path, e.g. `/blog/my-post/cover.png` (put the file in `public/blog/...`). |
| `draft`       | no       | `true` hides it from production builds; still visible in `npm run dev`. |

Supported: GitHub-flavoured Markdown (tables, task lists), fenced code blocks with syntax
highlighting (```ts, ```dart, ```sql …), `##`/`###` headings (they build the table of contents),
and `>` blockquotes (shown as callout boxes). Files starting with `_` are ignored.
