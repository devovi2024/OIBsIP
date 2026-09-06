/* ================================================================
   EXPRESSION PARSER & EVALUATOR (No eval() used)
   ================================================================ */

// 1. DOM REFS
const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const keypad = document.querySelector('.keypad');
const historyPanel = document.getElementById('history-panel');
const historyToggle = document.getElementById('history-toggle');
const historyList = document.getElementById('history-list');
const themeCheck = document.getElementById('theme-check');

// 2. STATE
let expression = '';
let justEvaluated = false;
let history = [];

// 3. HELPER: Clean floating point noise
function formatNumber(value) {
    if (!Number.isFinite(value)) return 'Error';
    return String(Math.round((value + Number.EPSILON) * 10000000000) / 10000000000);
}

// 4. TOKENIZER (Breaks "5+−3×2" into ["5", "+", "-3", "×", "2"])
function tokenize(input) {
    const raw = input
        .replace(/−/g, '-')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .match(/(?:\d+(?:\.\d*)?|\.\d+)|[+*/-]/g) || [];

    if (raw.join('') !== input.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s/g, '')) {
        throw new Error('Invalid expression');
    }

    const tokens = [];
    raw.forEach((token, index) => {
        // Unary negative detection (e.g., -5 or + -3)
        if (token === '-' && (index === 0 || ['+', '-', '*', '/'].includes(raw[index - 1]))) {
            const next = raw[index + 1];
            if (!next || !/^\d*\.?\d+$/.test(next)) throw new Error('Invalid expression');
            tokens.push(-Number(next));
            raw[index + 1] = '';
        } else if (token !== '') {
            tokens.push(/^\d|^\./.test(token) ? Number(token) : token);
        }
    });
    return tokens;
}

// 5. EVALUATOR (Handles * and / first, then + and -)
function evaluate(input) {
    const tokens = tokenize(input);
    if (!tokens.length || typeof tokens[0] !== 'number' || typeof tokens[tokens.length - 1] !== 'number') {
        throw new Error('Invalid expression');
    }

    // Pass 1: Handle Multiplication & Division
    const reduced = [tokens[0]];
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const value = tokens[i + 1];

        if (operator === '*' || operator === '/') {
            const left = reduced.pop();
            if (operator === '/' && value === 0) throw new Error('Cannot divide by zero');
            reduced.push(operator === '*' ? left * value : left / value);
        } else {
            reduced.push(operator, value);
        }
    }

    // Pass 2: Handle Addition & Subtraction
    let total = reduced[0];
    for (let i = 1; i < reduced.length; i += 2) {
        total = reduced[i] === '+' ? total + reduced[i + 1] : total - reduced[i + 1];
    }
    return formatNumber(total);
}

// 6. UI UPDATE
function updateDisplay(value) {
    const displayValue = value !== undefined ? value : expression || '0';
    expressionDisplay.textContent = expression || '0';
    resultDisplay.textContent = displayValue;
    resultDisplay.className = 'result';

    if (displayValue === 'Error' || displayValue === 'Cannot divide by zero') {
        resultDisplay.classList.add('error');
    } else if (Number(displayValue) < 0) {
        resultDisplay.classList.add('negative');
    } else if (Number(displayValue) > 0) {
        resultDisplay.classList.add('positive');
    }
}

// 7. INPUT HANDLERS
function addValue(value) {
    if (justEvaluated && !/[+−×÷]/.test(value)) expression = '';
    justEvaluated = false;

    const parts = expression.split(/[+−×÷]/);
    const current = parts[parts.length - 1];

    if (value === '.' && current.includes('.')) return;
    if (value === '.' && (!current || current === '-')) expression += '0';

    expression += value;
    updateDisplay();
}

function addOperator(operator) {
    if (!expression) return;
    if (/[+−×÷]$/.test(expression)) expression = expression.slice(0, -1) + operator;
    else expression += operator;
    justEvaluated = false;
    updateDisplay();
}

function calculate() {
    if (!expression || /[+−×÷.]$/.test(expression)) return;

    const shown = expression;
    let value;
    try {
        value = evaluate(expression);
    } catch (error) {
        expression = '';
        updateDisplay(error.message === 'Cannot divide by zero' ? error.message : 'Error');
        return;
    }

    if (value === 'Error') {
        expression = '';
        updateDisplay('Error');
        return;
    }

    // Save to history
    history.unshift({ expression: shown, result: value });
    history = history.slice(0, 10);
    renderHistory();

    expression = value;
    justEvaluated = true;
    updateDisplay(value);
}

function utility(action) {
    if (action === 'clear') {
        expression = '';
        justEvaluated = false;
        updateDisplay();
        return;
    }
    if (!expression) return;

    if (action === 'negate') {
        const match = expression.match(/(?:^|[+−×÷])-?(\d*\.?\d+)$/);
        if (match) {
            const start = expression.length - match[0].length;
            const prefix = expression.slice(0, start);
            const number = match[0].startsWith('-') ? match[0].slice(1) : '-' + match[0];
            expression = prefix + number;
        }
        updateDisplay();
    }

    if (action === 'percent') {
        const match = expression.match(/(\d*\.?\d+)$/);
        if (match) {
            expression = expression.slice(0, -match[0].length) + formatNumber(Number(match[0]) / 100);
        }
        updateDisplay();
    }
}

// 8. HISTORY RENDER
function renderHistory() {
    if (history.length) {
        historyList.innerHTML = history.map(item =>
            `<li><strong>${item.expression} = ${item.result}</strong></li>`
        ).join('');
    } else {
        historyList.innerHTML = `<li class="empty-history"><i class="fas fa-inbox"></i> Your completed calculations will appear here.</li>`;
    }
}

// 9. EVENT LISTENERS (Using addEventListener - No inline onclick)
keypad.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const { value, action } = button.dataset;

    if (value && /[+−×÷]/.test(value)) addOperator(value);
    else if (value) addValue(value);
    else if (action === 'equals') calculate();
    else utility(action);
});

historyToggle.addEventListener('click', () => {
    const open = historyPanel.classList.toggle('open');
    historyToggle.setAttribute('aria-expanded', String(open));
});

themeCheck.addEventListener('change', () => {
    document.body.classList.toggle('light-mode', themeCheck.checked);
});

// 10. KEYBOARD SUPPORT
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const map = { '*': '×', '/': '÷', '-': '−', 'Enter': '=', 'Escape': 'C' };
    const displayKey = map[key] || key;

    const button = [...document.querySelectorAll('.key')].find(item =>
        item.dataset.value === displayKey || item.textContent.trim() === displayKey
    );

    if (!['Tab', 'Shift', 'Control', 'Alt'].includes(key)) e.preventDefault();

    if (button) {
        button.classList.remove('pressed');
        void button.offsetWidth;
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 220);
    }

    if (/^\d$/.test(key) || key === '.') addValue(key);
    else if (['+', '-', '*', '/'].includes(key)) addOperator(map[key] || key);
    else if (key === 'Enter') calculate();
    else if (key === 'Backspace') {
        expression = expression.slice(0, -1);
        updateDisplay();
    } else if (key === 'Escape') utility('clear');
});

// 11. INIT
document.getElementById('year').textContent = new Date().getFullYear();
updateDisplay();