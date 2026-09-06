# TaskFlow – To-Do Web App

> "A simple to-do app? No. This is a lesson in state management, DOM synchronization, and localStorage persistence — all without a framework."

---

## 🧠 The Problem I Was Trying to Solve

"To-do apps are everywhere. But most tutorials teach you how to add and delete tasks. I wanted to build something that actually feels like a real app — with inline editing, persistent storage, and a clean UI that doesn't break on mobile."

**My goal:**
- Keep the UI in sync with the data at all times.
- Make editing feel natural (double-click or press edit, save with Enter, cancel with Escape).
- Save everything to `localStorage` so users don't lose their tasks on reload.

---

## ⚙️ Technical Challenges & How I Solved Them

### 1. How do I keep the UI in sync with the data?

- **Approach:** I keep all tasks in a single `tasks` array. Every time the data changes, I call `render()` which rebuilds the entire UI from that array.
- **Why:** This avoids the "UI and data out of sync" bug. The UI is always a reflection of the data, not the other way around.

> "This is the core principle of React and Vue — but I did it with vanilla JS."

---

### 2. How do I handle inline editing without breaking the UI?

- **Approach:** When a user clicks edit, I set `editingId` to the task's ID. During render, that task gets the `editing` CSS class, which hides the text and shows an input field.
- **Save:** Press `Enter` → save the new text.
- **Cancel:** Press `Escape` → revert to the original text.

> "The tricky part was managing focus and keyboard events. I had to attach global `keydown` listeners that only fire when `editingId` is set."

---

### 3. How do I persist tasks across page reloads?

- **Approach:** I use `localStorage`. Every time `render()` is called, I save the `tasks` array to `localStorage`. On page load, I read from `localStorage` and populate the `tasks` array.

> "This is the simplest form of persistence. No database, no backend — just the browser's built-in storage."

---

### 4. How do I handle task deletion with animation?

- **Approach:** When a delete button is clicked, I add a `removing` CSS class to the task item. This triggers a slide-out animation. After 250ms, I actually remove the task from the array and call `render()`.

> "This makes the app feel responsive and polished. Tasks don't just vanish — they slide away."

---

## 🎨 Why This UI?

| Element | Why I Chose It |
|---------|----------------|
| **Glassmorphism** | Makes the app feel modern and lightweight. |
| **Cyan / Purple gradient** | Gives the app a unique, energetic personality. |
| **Dark/Light mode** | Users expect it. I used `localStorage` to remember their preference. |
| **Emoji empty states** | Makes the app feel friendly, not robotic. |

---

## 🧪 What I Learned

| # | What I Learned | Why It Matters |
|---|----------------|----------------|
| 1 | **Single source of truth** – Keep data in one place, render from it. | Prevents UI/data desync. |
| 2 | **Event delegation** – One click listener on the document handles all buttons. | Better performance than attaching listeners to every button. |
| 3 | **Keyboard shortcuts** – Enter to add, Enter to save edit, Escape to cancel. | Makes the app faster for power users. |
| 4 | **localStorage is sync, not async.** | No callbacks, no promises — just read and write. |
| 5 | **Empty states are important.** | Users need to know the app is working, even when empty. |

---

## 💡 Final Thought

> "Building a to-do app is a rite of passage for every front-end developer. But building one that feels polished, handles edge cases, and persists data — that's where the real learning happens."

---

> ✍️ *"Code is just instructions. UX is understanding how people think."*