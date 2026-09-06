# SecureGate – Authentication System

> "A login system isn't just about checking credentials. It's about session management, security, lockout policies, and user experience — all without a backend."

---

## 🧠 The Problem I Was Trying to Solve

"Every web app needs authentication. But most tutorials show plain-text passwords and no session management. I wanted to build a system that actually feels secure — with hashed passwords, session tokens, account lockout, and a clean UI."

**My goal:**
- Store passwords securely using SHA-256 hashing.
- Manage sessions with time-based expiry (24h / 7 days).
- Lock accounts after 3 failed attempts.
- Provide a smooth, responsive UI with dark/light mode.

---

## ⚙️ Technical Challenges & How I Solved Them

### 1. How do I hash passwords without a backend?

- **Approach:** Use the **Web Crypto API** (`crypto.subtle.digest`) with SHA-256.
- **Why:** It's built into every modern browser. No external library needed.
- **Flow:** On registration, hash the password → store the hash. On login, hash the input → compare with stored hash.

> "This is the browser's version of bcrypt. It's not perfect, but it's secure enough for a frontend demo."

### 2. How do I manage sessions?

- **Approach:** Store a session object in `localStorage` with a `token` and `expires` timestamp.
- **Why:** `localStorage` persists across page reloads. I can check expiry on every page load.
- **Route Guard:** If the session is expired or missing, redirect to login.

> "I generate a UUID v4 token using `crypto.getRandomValues()` — cryptographically random."

### 3. How do I lock accounts after 3 failed attempts?

- **Approach:** Store `failedAttempts` and `lockedUntil` on the user object.
- **Logic:** On login failure, increment attempts. If attempts >= 3, set `lockedUntil = Date.now() + 5min`.
- **UI:** Show a countdown timer with the remaining lockout time.

> "This prevents brute-force attacks. Even without a backend, this adds a layer of protection."

### 4. How do I persist the theme?

- **Approach:** Use `localStorage` to save the user's theme preference.
- **Why:** Users expect their preference to survive page reloads.

> "It's a small UX detail, but it matters."

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | SHA-256 via Web Crypto API |
| **Session Token** | UUID v4 (cryptographically random) |
| **Session Expiry** | 24 hours (or 7 days with "Remember Me") |
| **Account Lockout** | 3 failed attempts → 5 minute lock |
| **Generic Error Messages** | "Invalid username or password" – doesn't reveal which field is wrong |
| **Route Guard** | Dashboard redirects to login if no valid session |

---

## 🧪 What I Learned

| # | What I Learned | Why It Matters |
|---|----------------|----------------|
| 1 | **Hashing is async.** | `crypto.subtle.digest` returns a Promise. I had to use `async/await`. |
| 2 | **Session expiry is critical.** | Without it, users stay logged in forever. |
| 3 | **Lockout prevents brute-force.** | Even without a backend, this is a must-have. |
| 4 | **Generic error messages are safer.** | Don't tell attackers whether the username or password is wrong. |
| 5 | **`localStorage` is synchronous.** | No callbacks. Just read and write. |

---

## 💡 Final Thought

> "Authentication is the foundation of every web app. Building it from scratch — with hashing, sessions, and lockout — taught me more than using a library ever could."

> ✍️ *"Security isn't a feature. It's a mindset."*