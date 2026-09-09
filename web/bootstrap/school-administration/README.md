# Ashbury — School Administration

A responsive **Bootstrap 5** education management dashboard for principals and registrars: students, teachers, classes, attendance, and reports. Built with **Bootstrap Icons**, **Open Sans**, and **Roboto**.

**School:** Ashbury Academy  
**Brand:** `#FB6C00`  
**Prefix:** `sa-*`  
**Signed in:** Subbu Poluru, Principal

## Template Overview

| Property | Value |
|---|---|
| Template Name | School Administration (Ashbury) |
| Category | Education, Admin dashboard |
| Framework | Bootstrap 5 |
| Interaction | Vanilla JavaScript |
| License | Free to use and customize |

## Features

- Fixed dark sidebar on desktop; overlay drawer on mobile
- Bell-schedule period chips (P1–P7) in the top bar, current period highlighted
- Skip link, live clock on the dashboard, notification indicator
- Student / teacher / class / absence search and filters
- Attendance form with absent checkboxes and toast feedback
- Homeroom and counselor-note actions on student cards
- Report export toast
- Empty states when filters match nothing

## Pages

| File | Description |
|---|---|
| `index.html` | Campus snapshot: KPIs, period 3 board, grade attendance, absences |
| `students.html` | Filterable student directory |
| `teachers.html` | Faculty roster and period status |
| `classes.html` | Daily schedule with roster / attend actions |
| `attendance.html` | Take attendance and today’s absence list |
| `reports.html` | Enrollment, ADA, and grade mix |
| `about.html` | Template story and tokens |
| `contact.html` | Front-office form |
| `documentation.html` | In-template documentation |

## File Structure

```text
school-administration/
├── index.html
├── students.html
├── teachers.html
├── classes.html
├── attendance.html
├── reports.html
├── about.html
├── contact.html
├── documentation.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## Getting Started

```bash
cd web/bootstrap/school-administration
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Customization

1. Replace campus name, staff, and student records in the HTML pages.
2. Change theme tokens in `assets/css/style.css` (`--sa-primary` is `#FB6C00`).
3. Keep `data-grade` / `data-subject` / `data-status` aligned with filter selects.
4. Point forms at your student information system when leaving the static demo.

## Brand

| Token | Value | Use |
|---|---|---|
| Primary | `#FB6C00` | CTAs, active nav, period chip |
| Ink | `#241812` | Sidebar, headings |
| Canvas | `#F7F2EC` | Page background |
| Surface | `#FFFDFA` | Cards |

Demo people include **Subbu Poluru**, Maya Poluru, Kavya Poluru, Arjun Poluru, Anika Poluru, Priya Poluru, Nikhil Poluru, Rohan Poluru, Leela Poluru, Dev Poluru, Ishaan Poluru, Meera Poluru, Tara Poluru, Nila Poluru, Ravi Poluru, and Asha Poluru.

## Author

**Subrahmanyam Poluru**

Website: https://polurus.com  
Email: mail.polurus@gmail.com
