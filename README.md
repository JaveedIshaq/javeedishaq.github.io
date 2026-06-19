# Next.js 16 Developer Portfolio Template

A modern, responsive, and SEO-optimized **Next.js 16 portfolio template** designed for developers, designers, and professionals. This open-source project helps you showcase your skills, experience, and projects with an elegant interface that stands out. Built with server-side rendering, TypeScript, and the latest web standards for optimal performance.

## ✨ Key Features

- **Professional Experience Timeline**: Showcase your career journey with a visually appealing timeline
- **Project Showcase**: Display your technical projects with detailed information and live demos
- **Multiple Themes**: Dark, Light, Retro, Cyberpunk, Aurora, Synthwave, and Paper themes
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **100% Performance Score**: Fully optimized for speed and Core Web Vitals
- **SEO-Ready**: Structured data, meta tags, and optimized content
- **Modern Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui
- **Easy Customization**: Well-organized code structure with minimal effort required
- **Animations**: Subtle animations for engaging user experience
- **Analytics Integration**: Ready for Google Analytics tracking
- **Contact Form**: Functional contact form with validation
- **Open Source**: Free to use and modify for your personal portfolio

## 🚀 Demo

View the live demo at [https://javeedishaq.com/](https://javeedishaq.com)

https://github.com/javeedishaq/minimal-next-portfolio/assets/82203888/f93bf5ca-c2bd-4fe5-a413-1050ebf6cf78

## Ranks #1 on AI Search (top-notch AEO/GEO)

https://github.com/user-attachments/assets/fc071310-9d1c-4832-877f-23f9569893d7

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: Server actions with validation
- **Analytics**: Google Analytics + Vercel Analytics
- **Deployment**: [GitHub Pages](https://pages.github.com/)

## 🔧 Getting Started

To get started with your own portfolio website:

1. Clone this repository:

   ```bash
   git clone https://github.com/javeedishaq/minimal-next-portfolio.git my-portfolio
   cd my-portfolio
   ```

2. Copy the contents of `.env.copy` to a new `.env` file and fill in the required information.

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your web browser to see the website.

## 🚀 Step-by-Step Guide: Deploy to GitHub Pages (`gh-pages` branch)

This project is configured to deploy to **GitHub Pages** using the `gh-pages` branch. Two methods are available. The **recommended orphan branch method** keeps the `gh-pages` branch clean — only built static files, served from root `/`. The alternative checkout/merge method preserves full git history but requires serving from the `/out` subdirectory.

### Quick Deploy Script

A ready-to-use deployment script is included in the project root:

```bash
chmod +x deploy.sh   # one-time: make executable
./deploy.sh          # build + deploy to gh-pages
```

This runs the orphan branch method (Method 1 below) in a single command.

### Prerequisites

- Node.js 18+ installed
- Git installed and configured
- Push access to this repository (`origin` remote)

---

### Method 1 (Recommended): Orphan Branch — Push Only `out/` to `gh-pages` (also via `deploy.sh`)

The `gh-pages` branch will contain **only** the built static files (no source code). GitHub Pages serves directly from root `/`.

**Why `git init`?** The `out/` directory is listed in `.gitignore` — the main project's git completely ignores it. To push `out/` to `gh-pages`, we create a **temporary, disposable git repo** inside `out/` (that's the `git init`). This ephemeral repo holds only the built static files. We force-push it to `gh-pages`, then delete the temporary `.git` folder. Next deployment does the same thing fresh — clean slate every time, no merge conflicts, no source code leaking into the deployed branch.

#### Step 1: Build the static site

Next.js generates a static export into the `out/` directory:

```bash
npm run build
```

#### Step 2: Push the `out/` directory as the `gh-pages` branch

```bash
# Navigate into the out/ directory
cd out

# Create a temporary, disposable git repo inside out/.
# This is NOT connected to the main project's git.
git init

# Add all static files
git add -A

# Commit
git commit -m "Deploy to GitHub Pages"

# Force push this temporary repo's contents to the gh-pages branch.
# Each run completely replaces the previous gh-pages contents.
git push --force https://github.com/JaveedIshaq/javeedishaq.github.io.git HEAD:gh-pages

# Clean up — go back to the project root
cd ..

# Remove the temporary .git so the main project is unaffected
rm -rf out/.git
```

#### Step 3: Verify the Deployment

1. Go to your repository on GitHub: `https://github.com/JaveedIshaq/javeedishaq.github.io`
2. Navigate to **Settings > Pages**
3. Under "Branch", confirm it shows:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Wait 1-2 minutes for GitHub Pages to deploy
5. Visit `https://javeedishaq.com` (or `https://javeedishaq.github.io`)

---

### Method 2 (Alternative): Checkout → Merge → Build → Push

Use this if you prefer to keep a proper git history on the `gh-pages` branch. Note that GitHub Pages will serve from the `/out` subdirectory (not root).

#### Step 1: Switch to the `gh-pages` branch

```bash
git checkout gh-pages
```

#### Step 2: Pull the latest changes from `main`

```bash
git pull origin main
```

If you have uncommitted local changes on `gh-pages`, stash or commit them first. If there are merge conflicts, resolve them before proceeding.

#### Step 3: Build the static site

```bash
npm run build
```

#### Step 4: Commit and push the `out/` directory

Since `out/` is likely in `.gitignore`, force-add it:

```bash
git add -f out/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

#### Step 5: Switch back to `main` (optional)

```bash
git checkout main
```

#### Step 6: Verify the Deployment

1. Go to your repository on GitHub: `https://github.com/JaveedIshaq/javeedishaq.github.io`
2. Navigate to **Settings > Pages**
3. Under "Branch", confirm it shows:
   - Branch: `gh-pages`
   - Folder: `/out` (since the static site lives in the `out/` subdirectory)
4. Wait 1-2 minutes for GitHub Pages to deploy
5. Visit `https://javeedishaq.com` (or `https://javeedishaq.github.io`)

---

### Quick Reference: Using the `gh-pages` npm Package (Alternative Automation)

If you have the GitHub CLI installed, you can automate with the `gh-pages` npm package:

```bash
# Install gh-pages as a dev dependency (one-time)
npm install --save-dev gh-pages

# Add this script to package.json:
# "deploy": "next build && gh-pages -d out -b gh-pages"

# Then deploy with:
npm run deploy
```

---

### Important Notes

#### `.nojekyll` — GitHub Pages Jekyll Bypass

GitHub Pages runs Jekyll by default, which **silently ignores all `_next/` assets** (directories starting with `_`). A blank `.nojekyll` file at the repository root disables this. It's tracked in `public/.nojekyll` and copied into every deployment automatically.

If you ever notice **CSS/JS missing** on the live site, this is almost certainly the cause. The fix is just ensuring `.nojekyll` exists in the deployed root (it's there now).

#### Custom Domain (`CNAME` file)

A `CNAME` file with `www.javeedishaq.com` is tracked in source at `public/CNAME`. **Next.js automatically copies `public/CNAME` → `out/CNAME` on every build.** The deploy script also verifies `out/CNAME` exists before pushing and falls back to the `public/` copy if missing.

To change the domain, edit `public/CNAME`, commit, and redeploy.

*Why `public/CNAME` and not GitHub Settings?* Every orphan-branch push completely replaces the `gh-pages` branch. If the `CNAME` were set only in **Settings > Pages**, it would be lost on every deploy. Tracking it in source guarantees it's always deployed.

#### Other Notes

- **No Server Features:** Static export means API routes, server actions, or server-side rendering **will not work** on GitHub Pages. This site must be fully static.
- **Environment Variables:** If your build uses `.env` variables, ensure they are set correctly before running `npm run build`.
- **First-Time Setup:** If this is the first deployment, go to **Settings > Pages** and set the source branch to `gh-pages` manually.
- **Gitignore Check:** The `out/` directory is likely listed in `.gitignore`. With **Method 2** (checkout/merge), you'll need to force-add it: `git add -f out/`. This is safe because the `gh-pages` branch is only used for deployment — the source code stays clean.

## 🎨 Customization

Easily personalize your portfolio using the configuration files below:

| Section            | How to Customize                                       | File Location             |
| ------------------ | ------------------------------------------------------ | ------------------------- |
| **Personal Info**  | Edit your name, bio, and social links                  | `config/site.ts`          |
| **Skills**         | Add or modify the technologies and skills you showcase | `config/skills.ts`        |
| **Projects**       | Highlight your technical projects                      | `config/projects.ts`      |
| **Experience**     | Add your work and professional experience              | `config/experience.ts`    |
| **Contributions**  | Display open-source/community contributions            | `config/contributions.ts` |
| **Colors & Theme** | Customize color palette and themes                     | `tailwind.config.js`      |

All configuration files are well-organized and documented for a smooth customization process.

## 🌟 Features In Detail

### Professional Experience Timeline

An interactive, animated timeline that showcases your career journey with expandable sections for details about each position and company.

### Project Showcase

Display your technical projects with detailed information, technologies used, live demo links, and comprehensive project descriptions.

### Skills Showcase

Visually represent your technical and soft skills with customizable ratings and categories.

### Contact Form Integration

A ready-to-use contact form that can connect to various backend services.

### SEO Optimization

Built-in SEO features with proper meta tags, structured data, and semantic HTML.

## 📱 Performance and Responsiveness

![best-portfolio-website-score](https://github.com/javeedishaq/minimal-next-portfolio/assets/82203888/3fb9c94d-9d99-4e98-92ea-14aadc91b568)
![100-score-vercel](https://github.com/javeedishaq/minimal-next-portfolio/assets/82203888/7cfe28cc-b619-4199-9dab-1cf16723b86d)

This template is optimized for:

- 100% Lighthouse score
- Excellent Core Web Vitals metrics
- Responsive design across all device sizes
- Fast loading times with proper image optimization

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- Design inspired by modern portfolio best practices
- Built by [Javeed Ishaq](https://github.com/javeedishaq)
- Icons from [Lucide](https://lucide.dev/)

## 💻 Deploy on Vercel

The easiest way to deploy your portfolio is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the platform from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=javeedishaq/minimal-next-portfolio&type=Date)](https://star-history.com/#javeedishaq/minimal-next-portfolio&Date)

---

**Built with ❤️ by [Javeed Ishaq](https://github.com/javeedishaq)**