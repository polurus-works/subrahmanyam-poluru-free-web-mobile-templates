# Ledger — Teacher Gradebook

A clean, responsive **teacher gradebook** for managing classes, scores, attendance, and report cards. Built for faculty desks, SIS demos, and school portals.

**Desk:** Ledger · Ashbury Academy  
**Brand:** `#0F3040`  
**Prefix:** `gb-*`  
**Teacher:** Kavya Poluru, English

Built with **HTML, CSS, JavaScript, Tailwind CSS (browser v4), Bootstrap Icons**, Roboto, and Open Sans.

## Template Overview

| Property | Value |
|---|---|
| Template Name | Teacher Gradebook (Ledger) |
| Category | Education, Dashboard |
| Framework | Tailwind CSS |
| Interaction | Vanilla JavaScript |
| License | Free to use and customize |

## Features

- Sticky sidebar navigation with mobile drawer and skip link
- Section switcher in the top bar (Lit 11A, Lit 11B, Homeroom)
- Teacher desk: enrollment, ungraded work, class average, attendance
- Class cards that jump into scores or the roster
- Spreadsheet-style scores with inline edits and toasts
- Attendance present / tardy / absent marking
- Report-card comment drafts with publish (demo)
- Hash routing, top search, reduced-motion handling

## Views

1. **Dashboard** — work to grade and today’s roster notes
2. **Classes** — Literature 11A, 11B, and Homeroom 11
3. **Scores** — essays, quizzes, discussion, midterm, current mark
4. **Attendance** — mark and save today’s roster
5. **Report cards** — comments for the active section

## File Structure

```text
teacher-gradebook/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## Getting Started

```bash
cd web/tailwind/teacher-gradebook
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Customization

1. Replace the teacher name, school, and section labels.
2. Update student rows, weights, and report-card copy.
3. Connect score / attendance / publish actions to your SIS.
4. Adjust colors in `assets/css/style.css` and the Tailwind `@theme` block (`--gb-primary` / `--color-brand` is `#0F3040`).

## Brand

| Token | Value | Use |
|---|---|---|
| Primary | `#0F3040` | Sidebar, buttons, marks |
| Deep | `#0A212C` | Button hover |
| Soft | `#E4EEF1` | Chips, progress track |
| Canvas | `#F3F6F7` | Page background |

Demo people include **Kavya Poluru** (teacher), Subbu Poluru, Maya Poluru, Priya Poluru, Leela Poluru, Ishaan Poluru, Tara Poluru, Nila Poluru, Ravi Poluru, Meera Poluru, Asha Poluru, Kiran Poluru, Sia Poluru, Veer Poluru, and Dev Poluru.

## Author

**Subrahmanyam Poluru**

Website: https://polurus.com  
Email: mail.polurus@gmail.com
