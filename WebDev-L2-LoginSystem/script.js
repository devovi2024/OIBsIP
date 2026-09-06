
"use strict";

// ================================================================
// CONSTANTS
// ================================================================
const STORAGE_USERS = "users";
const STORAGE_SESSION = "session";
const LOCKOUT_MS = 5 * 60 * 1000;
const SESSION_MS = 24 * 60 * 60 * 1000;
const REMEMBERED_SESSION_MS = 7 * SESSION_MS;

const views = {
    register: document.getElementById("register-view"),
    login: document.getElementById("login-view"),
    dashboard: document.getElementById("dashboard-view")
};

let lockoutTimer;

// ================================================================
// STORAGE HELPERS
// ================================================================
function getUsers() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_SESSION) || "null");
    } catch {
        return null;
    }
}

// ================================================================
// UI HELPERS
// ================================================================
function showMessage(element, message) {
    element.textContent = message;
    element.classList.add("show");
}

function hideMessage(element) {
    element.textContent = "";
    element.classList.remove("show");
}

function formatDate(value) {
    return new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

// ================================================================
// CRYPTO: SHA-256 HASHING (Web Crypto API)
// ================================================================
async function hashPassword(password) {
    const buffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password)
    );
    return Array.from(new Uint8Array(buffer))
        .map(function(byte) {
            return byte.toString(16).padStart(2, "0");
        })
        .join("");
}

// ================================================================
// SESSION TOKEN GENERATOR (UUID v4 style)
// ================================================================
function generateToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, function(byte) {
        return byte.toString(16).padStart(2, "0");
    }).join("");
    return (
        hex.slice(0, 8) + "-" +
        hex.slice(8, 12) + "-" +
        hex.slice(12, 16) + "-" +
        hex.slice(16, 20) + "-" +
        hex.slice(20)
    );
}

// ================================================================
// VIEW SWITCHING
// ================================================================
function showView(name) {
    Object.values(views).forEach(function(view) {
        view.classList.remove("active");
    });
    (views[name] || views.login).classList.add("active");

    if (name !== "login") hideMessage(document.getElementById("login-error"));
    if (name !== "register") {
        hideMessage(document.getElementById("register-error"));
        hideMessage(document.getElementById("register-success"));
    }

    window.location.hash = name === "register" ? "register" :
        name === "dashboard" ? "dashboard" : "login";
}

// ================================================================
// SESSION VALIDATION & ROUTE GUARD
// ================================================================
function validSession(session) {
    return session &&
        typeof session.token === "string" &&
        session.token.length === 36 &&
        session.expires > Date.now();
}

function routeGuard() {
    const session = getSession();
    if (validSession(session)) {
        renderDashboard(session);
        showView("dashboard");
        setTimeout(checkSessionExpiry, 1000);
    } else {
        localStorage.removeItem(STORAGE_SESSION);
        showView(window.location.hash === "#register" ? "register" : "login");
    }
}

function checkSessionExpiry() {
    if (validSession(getSession())) {
        setTimeout(checkSessionExpiry, 1000);
    } else {
        localStorage.removeItem(STORAGE_SESSION);
        showView("login");
    }
}

// ================================================================
// PASSWORD STRENGTH
// ================================================================
function passwordScore(password) {
    var score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    return score;
}

function updateStrength() {
    var password = document.getElementById("reg-password").value;
    var score = passwordScore(password);
    var meter = document.getElementById("strength-meter");
    var text = document.getElementById("strength-text");
    var labels = ["—", "Weak", "Medium", "Medium", "Strong"];
    var colors = ["var(--muted)", "var(--red)", "var(--gold)", "var(--gold)", "var(--green)"];

    meter.dataset.score = score;
    meter.style.setProperty("--strength-color", colors[score]);
    text.style.setProperty("--strength-color", colors[score]);
    text.textContent = "Strength: " + labels[score];
}

function updateMatch() {
    var password = document.getElementById("reg-password").value;
    var confirm = document.getElementById("reg-confirm").value;
    var indicator = document.getElementById("match-indicator");

    if (!confirm) {
        indicator.textContent = "";
        indicator.className = "match";
        return;
    }

    indicator.textContent = password === confirm ? "✓" : "✕";
    indicator.className = "match " + (password === confirm ? "good" : "bad");
}

// ================================================================
// BUTTON BUSY STATE
// ================================================================
function setButtonBusy(button, busy) {
    button.disabled = busy;
    button.textContent = busy ? "⏳ Processing..." : button.dataset.label;
}

// ================================================================
// REGISTRATION
// ================================================================
document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    var error = document.getElementById("register-error");
    var button = document.getElementById("register-button");

    hideMessage(error);
    hideMessage(document.getElementById("register-success"));

    var username = document.getElementById("reg-username").value.trim();
    var email = document.getElementById("reg-email").value.trim().toLowerCase();
    var password = document.getElementById("reg-password").value;
    var confirm = document.getElementById("reg-confirm").value;

    // Validation
    if (!username || !email || !password || !confirm || !document.getElementById("terms").checked) {
        return showMessage(error, "Please complete every required field and accept the terms.");
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return showMessage(error, "Username must be 3-20 characters using letters, numbers, or underscores.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showMessage(error, "Enter a valid email address.");
    }

    if (passwordScore(password) < 3) {
        return showMessage(error, "Password must be at least 8 characters with a number and special character.");
    }

    if (password !== confirm) {
        return showMessage(error, "Passwords do not match.");
    }

    var users = getUsers();
    if (users.some(function(user) {
            return user.username.toLowerCase() === username.toLowerCase() ||
                user.email.toLowerCase() === email;
        })) {
        return showMessage(error, "That username or email is already registered.");
    }

    // Create user
    setButtonBusy(button, true);

    var user = {
        id: generateToken(),
        username: username,
        email: email,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
        loginHistory: [],
        failedAttempts: 0,
        lockedUntil: null
    };

    users.push(user);
    saveUsers(users);

    setButtonBusy(button, false);
    showMessage(document.getElementById("register-success"), "✅ Account created! Redirecting to login...");

    setTimeout(function() {
        document.getElementById("login-username").value = username;
        showView("login");
    }, 1800);
});

// ================================================================
// LOGIN
// ================================================================
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    var error = document.getElementById("login-error");
    var button = document.getElementById("login-button");

    hideMessage(error);
    clearInterval(lockoutTimer);

    var identity = document.getElementById("login-username").value.trim();
    var password = document.getElementById("login-password").value;

    if (!identity || !password) {
        return showMessage(error, "Please enter your username or email and password.");
    }

    var users = getUsers();
    var index = users.findIndex(function(user) {
        return user.username.toLowerCase() === identity.toLowerCase() ||
            user.email.toLowerCase() === identity.toLowerCase();
    });
    var user = index >= 0 ? users[index] : null;

    // Check lockout
    if (user && user.lockedUntil && user.lockedUntil > Date.now()) {
        return startLockoutCountdown(error, user.lockedUntil);
    }

    setButtonBusy(button, true);

    var valid = user && (await hashPassword(password)) === user.passwordHash;

    if (!valid) {
        if (user) {
            user.failedAttempts = (user.failedAttempts || 0) + 1;
            if (user.failedAttempts >= 3) {
                user.lockedUntil = Date.now() + LOCKOUT_MS;
                user.failedAttempts = 0;
            }
            users[index] = user;
            saveUsers(users);
        }
        setButtonBusy(button, false);
        if (user && user.lockedUntil) {
            return startLockoutCountdown(error, user.lockedUntil);
        }
        return showMessage(error, "⚠️ Invalid username or password.");
    }

    // Success
    var now = new Date().toISOString();
    user.failedAttempts = 0;
    user.lockedUntil = null;
    user.loginHistory = [now].concat(user.loginHistory || []).slice(0, 3);
    users[index] = user;
    saveUsers(users);

    var rememberMe = document.getElementById("remember-me").checked;
    localStorage.setItem(STORAGE_SESSION, JSON.stringify({
        token: generateToken(),
        username: user.username,
        expires: Date.now() + (rememberMe ? REMEMBERED_SESSION_MS : SESSION_MS),
        rememberMe: rememberMe
    }));

    setButtonBusy(button, false);
    renderDashboard(getSession());
    showView("dashboard");
    checkSessionExpiry();
});

// ================================================================
// LOCKOUT COUNTDOWN
// ================================================================
function startLockoutCountdown(element, until) {
    function tick() {
        var remaining = Math.max(0, until - Date.now());
        if (!remaining) {
            clearInterval(lockoutTimer);
            hideMessage(element);
            return;
        }
        var seconds = Math.ceil(remaining / 1000);
        var minutes = Math.floor(seconds / 60);
        var secs = String(seconds % 60).padStart(2, "0");
        showMessage(element, "⚠️ Account temporarily locked. Try again in " +
            minutes + " minutes (" + minutes + ":" + secs + ").");
    }
    tick();
    lockoutTimer = setInterval(tick, 1000);
}

// ================================================================
// DASHBOARD RENDER
// ================================================================
function renderDashboard(session) {
    var user = getUsers().find(function(item) {
        return item.username === session.username;
    });

    if (!user) {
        localStorage.removeItem(STORAGE_SESSION);
        return showView("login");
    }

    document.getElementById("welcome-name").textContent = user.username;
    document.getElementById("dashboard-email").textContent = user.email;
    document.getElementById("dashboard-created").textContent = formatDate(user.createdAt);
    document.getElementById("dashboard-login").textContent = formatDate(user.loginHistory[0]);
    document.getElementById("session-expiry").textContent = formatDate(session.expires);

    var activityList = document.getElementById("activity-list");
    if (user.loginHistory && user.loginHistory.length) {
        activityList.innerHTML = user.loginHistory.map(function(stamp) {
            return "<li>" + formatDate(stamp) + "</li>";
        }).join("");
    } else {
        activityList.innerHTML = "<li>No previous activity</li>";
    }
}

// ================================================================
// EVENT LISTENERS
// ================================================================
// View switching
document.querySelectorAll("[data-view]").forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        showView(link.dataset.view);
    });
});

// Password toggle
document.querySelectorAll(".toggle-password").forEach(function(toggle) {
    toggle.addEventListener("click", function() {
        var input = document.getElementById(toggle.dataset.target);
        var icon = toggle.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.className = "fas fa-eye-slash";
        } else {
            input.type = "password";
            icon.className = "fas fa-eye";
        }
    });
});

// Password strength & match
document.getElementById("reg-password").addEventListener("input", function() {
    updateStrength();
    updateMatch();
});
document.getElementById("reg-confirm").addEventListener("input", updateMatch);

// Forgot password
document.getElementById("forgot-password").addEventListener("click", function() {
    showMessage(document.getElementById("login-error"),
        "Password recovery requires administrator assistance in this demo.");
});

// Logout
document.getElementById("logout-button").addEventListener("click", function() {
    localStorage.removeItem(STORAGE_SESSION);
    document.getElementById("login-form").reset();
    showView("login");
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("change", function(event) {
    document.body.classList.toggle("light-mode", event.target.checked);
    localStorage.setItem("theme", event.target.checked ? "light" : "dark");
});

// ================================================================
// INITIALIZATION
// ================================================================
document.getElementById("footer-year").textContent = new Date().getFullYear();

document.querySelectorAll("button[type=submit]").forEach(function(button) {
    button.dataset.label = button.textContent;
});

window.addEventListener("scroll", function() {
    document.body.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

window.addEventListener("hashchange", function() {
    if (!validSession(getSession())) {
        showView(window.location.hash === "#register" ? "register" : "login");
    }
});

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    document.getElementById("theme-toggle").checked = true;
}

routeGuard();