# Tribute Page – Dr. A.P.J. Abdul Kalam

> "This project isn't just about a historical figure. It's about how I approached the problem, the technical decisions I made, and what I learned while building it."

---

## 🧠 The Problem I Was Trying to Solve

"Most tribute pages are just: photo + dates + a quote. That's boring. I wanted users to actually read the entire biography without getting bored or leaving early."

**My goal:**
- Make long-form content feel immersive, not heavy.
- Turn the page into an **emotional journey**, not just a wall of text.

---

## ⚙️ Technical Challenges & How I Solved Them

### 1. How do I animate timeline cards without killing performance?

- **Wrong approach:** `window.addEventListener('scroll', ...)` – fires hundreds of times per second. Slow and heavy.
- **Right approach:** `IntersectionObserver` – fires only when an element actually enters the viewport.

> "I learned: stop listening to scroll. Tell the browser: 'Let me know when you see this element.'"

---

### 2. How do I toggle dark/light mode without resetting on reload?

- Used `localStorage`. When the user toggles the theme, I save it. On page load, I check that value and apply the correct theme.

> "It's a small UX detail, but as a developer, persistence matters. User preference should never reset on reload."

---

### 3. How did I add parallax to the hero background?

- Put the background image on a separate layer.
- Moved it at **18% of the scroll speed** (`scrollY * 0.18`).
- Used `transform: scale(1.08)` so there's no empty space when it moves.

> "Parallax looks great, but too much movement causes motion sickness. That's why I kept it slow – `0.18x` felt right."

---

### 4. How did I make the mobile menu accessible?

- Used a `<button>` with `aria-expanded` so screen readers know if the menu is open or closed.
- Auto-close the menu when a link is clicked – so users don't have to manually close it.

> "Accessibility isn't a 'nice-to-have'. It's a must. This small detail makes the page usable for everyone."

---

## 🎨 Design Decisions (Why These Colors?)

| Design Element | Why I Chose It |
|----------------|----------------|
| **Gold (#D4AF37)** | Represents legacy, achievement, and the "Missile Man" glory. |
| **Deep Navy (#0B0E14)** | Feels serious, stable, and timeless. |
| **Cream (#F8F3E9)** | Used only for the biography section – breaks the dark monotony and improves readability for long text. |
| **Playfair Display (Font)** | Classic, elegant – perfect for a legendary figure. |
| **Inter (Font)** | Clean, modern body text – highly readable. |

---

## 🧪 What I Learned from This Project

| # | What I Learned | Why It Matters |
|---|----------------|----------------|
| 1 | `IntersectionObserver` is better than `scroll` events. | 10x more performant. Doesn't block the main thread. |
| 2 | Theme must persist in `localStorage`. | User preference should survive page reloads. |
| 3 | Parallax must be slow. | Fast parallax causes motion sickness. `0.18x` is safe. |
| 4 | Always use `aria-expanded` for mobile menus. | Screen reader users depend on it. |
| 5 | Timeline vertical lines are tricky to maintain. | Used `::before` for the line, absolute positioning for the dots. |

---

## 💡 Final Thought (What I Actually Learned)

> "This project taught me that CSS and JavaScript aren't just for making things look good – they're for creating an **experience**. Users don't need to be forced to read. If the page itself feels engaging, they'll stay on their own."

---

## 🚀 Now You Understand the Developer Mindset

| Before (Wrong Understanding) | Now (Developer Mindset) |
|------------------------------|--------------------------|
| "I added timeline animations." | "I used `IntersectionObserver` because `scroll` events are slow." |
| "I added dark mode." | "I used `localStorage` to persist theme so it doesn't reset on reload." |
| "I added parallax." | "I kept the speed at `0.18x` because faster movement causes nausea." |
| "I added a menu." | "I used `aria-expanded` to make it accessible for screen readers." |