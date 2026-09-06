# Calculator – Expression Parser with Precedence

A browser-based arithmetic engine that tokenizes expressions, handles unary operators, and evaluates them using a two-pass precedence model—**without relying on `eval()`**.


---

## 🔍 Why This Exists

Most beginner calculators use `eval()` or simple left-to-right logic.  
This one exists to demonstrate:

- **Lexical Analysis** – breaking `"5+−3×2"` into meaningful tokens (`5`, `+`, `-3`, `×`, `2`).
- **Operator Precedence** – ensuring `×` and `÷` are evaluated before `+` and `−`.
- **Unary Negation** – correctly parsing `−3 + 5` (the minus is part of the number, not an operator).
- **Safe Evaluation** – no `eval()`, no `Function()` constructor. Pure mathematical parsing.

---

## 🧠 How It Works (The Core Logic)

### 1. Tokenization
The input string is normalized (replaces `×` with `*`, `÷` with `/`) and split into an array of numbers and operators.

### 2. Unary Detection
If a `-` appears at the start of the expression or right after another operator, it is absorbed into the next number (e.g., `-5` becomes a single negative number token).

### 3. Two-Pass Evaluation
- **Pass 1**: Iterates through tokens. Handles `*` and `/` immediately, collapsing them into a single number.
- **Pass 2**: Iterates through the remaining tokens. Handles `+` and `-` sequentially.

### 4. Edge Cases
- Division by zero → catches the error and displays a friendly message.
- Invalid expressions (e.g., trailing operators) → gracefully ignores or resets.

---

## 🎨 UI/UX Decisions

- **Glassmorphism Panel** – Gives a premium, modern feel while keeping the focus on the display.
- **Dynamic Result Coloring** – Positive numbers glow green, negative numbers glow blue, and errors turn red. Provides instant visual feedback.
- **History Panel** – Stores the last 10 calculations locally (in memory). Helps users track their work without cluttering the main display.
- **Keyboard Mapping** – All keys are mapped to physical keyboard events. Press `Enter` to evaluate, `Backspace` to delete, `Escape` to clear.

---

## 🛠️ Tech Stack (Why These Choices?)

| Technology | Why Chosen |
|------------|------------|
| **Vanilla JS** | No framework overhead. Core logic is small, fast, and dependency-free. |
| **CSS Custom Properties** | Enables seamless dark/light mode switching without recompiling styles. |
| **Event Delegation** | One click listener on the keypad container handles all buttons—better performance and less memory usage. |
| **`contenteditable`-like logic** | The display updates on every keystroke, mimicking a real calculator's "live" feel. |

---
