## Innverse X Hackathon Playbook

### Mission
- Ship a polished StudyFlow prototype that proves intelligent planning, not a fully featured LMS.
- Every feature must highlight clear student value (faster planning, clearer schedules, motivation aids).
- Prefer incremental usability wins over speculative architecture changes.

### Delivery Priorities
- Maintain a working `npm run dev` at all times; broken builds block the demo and are unacceptable.
- Target 90 FPS interactions on modern laptops; avoid expensive loops, redundant renders, or heavy assets over 500 KB.
- Each pull request should either improve user experience or developer productivity—never both halfway.

### Engineering Standards
- Use TypeScript strictness already configured by Vite/TSX; add types when introducing new modules or props.
- Keep network requests centralized (hooks or helper utilities). UI components should only consume formatted data.
- Favor composition: shared UI belongs in `src/app/components/ui` or a dedicated helper file, not duplicated per screen.
- When touching date logic, rely on `date-fns` helpers and keep everything in ISO strings until final render.
- Any async side-effect must handle loading, success, and failure states without crashing the UI.

### Design + UX
- Styling lives in Tailwind classes or the existing theme tokens; no inline style objects unless dynamic values demand it.
- Typography scale: hero 64/48 px, section titles 32/24 px, body copy 18/16 px. Stay within that ladder for consistency.
- Gradient direction: left-to-right blues/purples for primary CTAs, warm gradients only for warnings/timeline banners.
- Buttons: max one primary per container; pair with outline/ghost variants for secondary actions.
- Layouts must remain responsive down to 360 px width using flex/grid—never rely on absolute positioning for structure.

### Accessibility & Content
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large headings; test gradients with overlay text.
- All interactive elements need discernible labels (`aria-label` when icon-only).
- Date strings shown to users should follow `Mon, Dec 14` format; avoid numeric DD/MM ambiguity.
- Keep copy action-oriented and concise; avoid marketing jargon that obscures the task.

### Data + Integrations
- Time-sensitive data (e.g., India Standard Time) must fetch through our Vite proxy (`/api/windows-time`) or equivalent server endpoint—never hit third-party origins directly from the browser.
- Sensitive inputs stay client-side; no persistence beyond session storage unless explicitly approved.
- When mocking data, annotate the file with `// Temporary mock for Innverse X demo` so it is easy to locate later.

### Review Checklist
- Does the change highlight a user-facing improvement that can be demoed in under 30 seconds?
- Are there console warnings or unhandled promise rejections? If yes, fix them before pushing.
- Can the reviewer understand the update by reading the diff plus a one-paragraph summary? If not, improve structure or docs.

Keep this guide short—if a new rule becomes critical for the hackathon, add it here and remove anything obsolete immediately.
