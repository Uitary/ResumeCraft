# ResumeCraft

A free, browser-based resume builder. Fill in a form, watch a live A4 preview update instantly, and export a polished resume as PDF, JPG, or an editable Word document — no sign-up, no backend, nothing installed.

**Live demo:** [myresumecreation.vercel.app](https://myresumecreation.vercel.app)

## Features

- **Live A4 preview** — every keystroke updates a true-to-size resume preview (210 × 297 mm) next to the form.
- **Full resume sections** — personal info with profile photo, objective, education, experience, skills, and a certification statement, each with add/remove controls.
- **Required-field guidance** — mandatory fields (name, contact info, first education entry) are clearly marked and highlight in red until filled in.
- **Separate Preview page** — opens the finished resume in its own tab with its own Print / Download PDF / Download JPG toolbar and a button to jump back to the editor.
- **Multiple export formats**
  - **PDF** and **JPG** via [html2canvas](https://github.com/niklasvh/html2canvas) + [jsPDF](https://github.com/parallax/jsPDF)
  - **DOCX** (editable Word file) via [docx.js](https://github.com/dolanmiu/docx)
  - Direct browser **Print**
- **Mobile friendly** — the resume automatically scales to fit small screens instead of overflowing, and the form/buttons adapt to touch.
- **No build step, no backend** — pure HTML, CSS, and vanilla JavaScript. Everything runs client-side; nothing you type ever leaves your browser.

## Tech Stack

| Purpose            | Library                                             |
|--------------------|------------------------------------------------------|
| Screenshot → image  | [html2canvas](https://github.com/niklasvh/html2canvas) |
| Image → PDF          | [jsPDF](https://github.com/parallax/jsPDF)            |
| DOCX generation      | [docx](https://github.com/dolanmiu/docx)              |
| Fonts                | [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

No frameworks, no package manager, no build tooling required.

## Project Structure

```
.
├── index.html      # Main resume builder (form + live preview)
├── preview.html    # Standalone preview page (opened via "Preview Page")
├── style.css       # All styling, shared by both pages
├── script.js       # Form logic, live preview rendering, exports
└── README.md
```

## Getting Started

Since this is a static site with no build step, you can run it in any of the following ways:

**Option 1 — Just open it**
Download or clone the repo and open `index.html` directly in your browser.

**Option 2 — Local server (recommended)**
Some browsers restrict certain features (like pop-ups for the Preview page) when files are opened directly with `file://`. Serving locally avoids that:

```bash
git clone https://github.com/Uitary/<repo-name>.git
cd <repo-name>
python3 -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

## Deployment

The live demo is deployed on [Vercel](https://vercel.com). Since there's no build step, deploying your own copy is as simple as importing the repo into Vercel and leaving the framework preset as "Other" — it will serve the static files as-is.

## Usage

1. Fill in your personal information, objective, education, experience, skills, and certification statement.
2. Watch the live preview on the right update in real time.
3. Optionally upload a profile photo.
4. Click **Preview Page** to review the resume full-screen, or use the export buttons to download it as **PDF**, **JPG**, or **DOCX**, or send it straight to your printer.

## Roadmap Ideas

- Multiple resume templates/color themes
- Save/load resume data (e.g. local storage or account-based)
- Drag-and-drop section reordering

Contributions and suggestions are welcome — feel free to open an issue or a pull request.

## Author

**Ivankaizer Zaldivar**

- GitHub: [github.com/Uitary](https://github.com/Uitary)
- LinkedIn: [linkedin.com/in/ivankaizer-zaldivar](https://www.linkedin.com/in/ivankaizer-zaldivar)
- Facebook: [facebook.com/ivankaizer.zaldivar.7](https://www.facebook.com/ivankaizer.zaldivar.7)
- Instagram: [@zzxiz.er](https://www.instagram.com/zzxiz.er/)
- TikTok: [@ywerx.en](https://www.tiktok.com/@ywerx.en)

## License

This project is available for personal and portfolio use. If you'd like a specific open-source license (MIT, etc.) attached, add a `LICENSE` file to the repo and reference it here.
