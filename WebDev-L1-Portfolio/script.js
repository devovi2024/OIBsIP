/* ================================================================
   SCRIPT.JS – Complete JavaScript for DevOps Portfolio
   ================================================================ */

// ================================================================
// 1. CONTACT FORM VALIDATION
// ================================================================
document.getElementById('contactForm').setAttribute('novalidate', '');

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('formMessage');

    // Validation
    if (!name || !email || !message) {
        status.textContent = '✕ Validation failed: all fields are required.';
        status.style.color = '#ff4d4d';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = '✕ Validation failed: please enter a valid email address.';
        status.style.color = '#ff4d4d';
        return;
    }

    // Success
    status.textContent = '✔ Message delivered to ' + name + '. Awaiting response.';
    status.style.color = '#00ffaa';
    this.reset();

    // Auto-clear success message after 5 seconds
    setTimeout(function () {
        status.textContent = '';
    }, 5000);
});

// ================================================================
// 2. RESUME BUTTON (Toast Notification)
// ================================================================
document.getElementById('resume').addEventListener('click', function () {
    const toast = document.createElement('div');
    toast.textContent = '📄 Resume build triggered via CI/CD Pipeline. Check artifacts.';
    toast.style.cssText =
        'position:fixed; right:20px; bottom:20px; background:#00ffaa; color:#080c14; padding:14px 18px; font:12px DM Mono, monospace; z-index:50; border-radius:4px; box-shadow:0 4px 20px rgba(0,0,0,0.4);';
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 4000);
});

// ================================================================
// 3. TERMINAL COMMANDS
// ================================================================
const output = document.getElementById('terminalOutput');

const terminalData = {
    about:
        'NAME     Alex Morgan\n' +
        'TITLE    Senior DevOps / SRE Engineer\n' +
        'EXP      6+ years in production systems\n' +
        'FOCUS    Cloud platforms, Kubernetes, delivery\n' +
        'MINDSET  Automate everything. Measure everything. Scale everything.',

    skills:
        'TOOLCHAIN\n\n' +
        'Kubernetes  ███████████████████ 95%\n' +
        'AWS         ██████████████████  90%\n' +
        'Terraform   █████████████████   85%\n' +
        'ArgoCD      ████████████████    82%\n' +
        'Observability ███████████████   80%',

    projects:
        'PROJECT VAULT\n\n' +
        '→ High-Availability EKS Cluster\n' +
        '→ Zero-Downtime Migration\n' +
        '→ GitOps with ArgoCD & Crossplane\n\n' +
        'Select a case study below to inspect it.',

    contact:
        'CONTACT\n\n' +
        '┌─────────────────────────────────────┐\n' +
        '│ alex.morgan@ops.example             │\n' +
        '│ linkedin.com/in/alexmorgan          │\n' +
        '└─────────────────────────────────────┘\n\n' +
        'Ready when you are. Scroll to transmit.'
};

function renderCommand(name) {
    output.textContent = terminalData[name] || 'Command not found.';
    if (name === 'projects') {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
    if (name === 'contact') {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('.cmd').forEach(function (btn) {
    btn.addEventListener('click', function () {
        renderCommand(this.dataset.command);
    });
});

// ================================================================
// 4. TERMINAL BOOT SEQUENCE (Typing Effect)
// ================================================================
const bootLines = [
    'Boot: DevOps Portfolio v4.2.1',
    'Checking Kubeconfig... OK.',
    'Terraform Validate... Success.',
    'Connecting to Observability Stack... Connected.',
    'Type ./help to discover my expertise.'
];

let bootIndex = 0;
const typedElement = document.getElementById('typed');

function typeBootSequence() {
    if (bootIndex < bootLines.length) {
        typedElement.textContent = bootLines[bootIndex];
        bootIndex++;
        setTimeout(typeBootSequence, 350);
    }
}

setTimeout(typeBootSequence, 400);

// ================================================================
// 5. COUNTER ANIMATION (Intersection Observer)
// ================================================================
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = '1';
            const target = parseInt(entry.target.dataset.target);
            let value = 0;
            const step = Math.ceil(target / 65);

            function tick() {
                value = Math.min(target, value + step);
                entry.target.textContent = value.toLocaleString();
                if (value < target) {
                    requestAnimationFrame(tick);
                }
            }
            tick();
        }
    });
}, { threshold: 0.4 });

counters.forEach(function (c) {
    counterObserver.observe(c);
});

// ================================================================
// 6. PIPELINE STATUS UPDATER
// ================================================================
const statuses = ['Healthy', 'Deploying...', 'Rollback Prepared', 'Healthy'];
let statusIndex = 0;

setInterval(function () {
    statusIndex = (statusIndex + 1) % statuses.length;
    document.getElementById('pipelineStatus').textContent = statuses[statusIndex];
}, 10000);

// ================================================================
// 7. PROJECT MODAL SYSTEM
// ================================================================
const modal = document.getElementById('modal');

const projectData = {
    eks: {
        title: 'High-Availability EKS Cluster',
        role: 'Lead Platform Engineer',
        challenge: 'A critical API platform was constrained by manual releases and a single-region cluster. Traffic patterns were volatile and recovery depended on tribal knowledge. The team needed reliable delivery without trading away developer speed.',
        solution: [
            'Used Terraform for VPC, EKS, and RDS.',
            'Implemented Cluster Autoscaler and multi-AZ node groups.',
            'Added ArgoCD, PodDisruptionBudgets, and automated DR drills.'
        ],
        results: 'Reduced cloud spend by 35% by implementing Spot Instances and right-sizing EC2 resources.',
        arch: '[ Git ] → [ GitLab CI ] → [ ArgoCD ]\n                         ↓\n             [ EKS / Multi-AZ ] → [ RDS ]',
        tags: ['AWS', 'EKS', 'Terraform', 'ArgoCD', 'RDS']
    },
    migration: {
        title: 'Zero-Downtime Migration',
        role: 'Solo Cloud Architect',
        challenge: 'A legacy monolith ran on aging on-premise infrastructure with narrow maintenance windows. A major seasonal traffic event made an in-place migration too risky. The move had to be observable, reversible, and invisible to customers.',
        solution: [
            'Mapped dependencies and introduced a strangler pattern.',
            'Built a parallel AWS landing zone with Terraform.',
            'Used weighted DNS and blue/green cutovers with live rollback.'
        ],
        results: 'Achieved 99.99% uptime during Black Friday traffic by implementing a robust autoscaling strategy.',
        arch: '[ Users ] → [ Route 53 / Weighted ]\n                  ↙             ↘\n        [ On-Prem ]             [ AWS VPC ]\n                                  ↓\n                         [ ECS + RDS ]',
        tags: ['AWS', 'Route 53', 'Terraform', 'Migration', 'SRE']
    },
    gitops: {
        title: 'GitOps with ArgoCD & Crossplane',
        role: 'Lead Developer Experience',
        challenge: 'Twenty teams shipped through bespoke pipelines that drifted from the real infrastructure. Provisioning took days and operational ownership was unclear. A common platform contract was needed without creating a central bottleneck.',
        solution: [
            'Standardized GitLab CI templates and environment repositories.',
            'Used Crossplane compositions for self-service cloud resources.',
            'Added policy checks, preview environments, and progressive delivery.'
        ],
        results: 'Reduced deployment lead time from 45 minutes to 5 minutes using GitLab CI and ArgoCD.',
        arch: '[ Developer ] → [ GitLab ] → [ ArgoCD ]\n                          ↓\n                 [ Crossplane ] → [ Cloud APIs ]',
        tags: ['ArgoCD', 'Crossplane', 'GitLab', 'GitOps', 'OPA']
    }
};

document.querySelectorAll('.project').forEach(function (card) {
    card.addEventListener('click', function () {
        const key = this.dataset.project;
        const p = projectData[key];
        if (!p) return;

        document.getElementById('modalTitle').textContent = p.title;
        document.getElementById('modalRole').textContent = p.role;
        document.getElementById('modalChallenge').textContent = p.challenge;
        document.getElementById('modalResults').textContent = p.results;
        document.getElementById('modalArch').textContent = p.arch;

        const solutionList = document.getElementById('modalSolution');
        solutionList.innerHTML = '';
        p.solution.forEach(function (item) {
            const li = document.createElement('li');
            li.textContent = item;
            solutionList.appendChild(li);
        });

        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        p.tags.forEach(function (tag) {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        modal.classList.add('open');
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('open');
}

document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// ================================================================
// 8. TELEMETRY GRAPH (Canvas)
// ================================================================
const canvas = document.getElementById('telemetry');
const ctx = canvas.getContext('2d');

function drawGraph() {
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(147,175,169,0.14)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h; y += 52) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // Data lines
    function drawLine(color, offset, amp) {
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = offset +
                Math.sin(x * 0.018) * amp +
                Math.sin(x * 0.049) * 9 +
                (Math.random() - 0.5) * 1.5;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawLine('#9df2ce', 105, 26);
    drawLine('#6ee7f2', 178, 20);
}

drawGraph();

window.addEventListener('resize', function () {
    drawGraph();
});

// ================================================================
// 9. CPU SIMULATION
// ================================================================
setInterval(function () {
    const cpu = 38 + Math.floor(Math.random() * 13);
    document.getElementById('cpu').textContent = cpu + '%';
}, 3200);

// ================================================================
// 10. MOBILE NAV TOGGLE
// ================================================================
document.querySelector('.menu').addEventListener('click', function () {
    document.querySelector('.nav').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
        document.querySelector('.nav').classList.remove('open');
    });
});

// ================================================================
// 11. DYNAMIC YEAR IN FOOTER
// ================================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ================================================================
// 12. HERO CANVAS (Particle Network)
// ================================================================
const heroPackets = document.getElementById('heroPackets');
const packetCtx = heroPackets.getContext('2d');
let packetDots = [];

function sizePacketCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight - 70;
    heroPackets.width = w * dpr;
    heroPackets.height = h * dpr;
    packetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    packetDots = [];
    for (let i = 0; i < 34; i++) {
        packetDots.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22
        });
    }
}

function animatePackets() {
    const w = window.innerWidth;
    const h = window.innerHeight - 70;

    packetCtx.clearRect(0, 0, w, h);
    packetCtx.strokeStyle = 'rgba(0,229,255,0.08)';
    packetCtx.lineWidth = 1;

    packetDots.forEach(function (dot, index) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > w) dot.vx *= -1;
        if (dot.y < 0 || dot.y > h) dot.vy *= -1;

        for (let j = index + 1; j < packetDots.length; j++) {
            const other = packetDots[j];
            const dx = dot.x - other.x;
            const dy = dot.y - other.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 125) {
                packetCtx.globalAlpha = 1 - distance / 125;
                packetCtx.beginPath();
                packetCtx.moveTo(dot.x, dot.y);
                packetCtx.lineTo(other.x, other.y);
                packetCtx.stroke();
            }
        }

        packetCtx.globalAlpha = 1;
        packetCtx.fillStyle = (index % 5 === 0) ? '#ff9900' : '#00ffaa';
        packetCtx.fillRect(dot.x, dot.y, 2, 2);
    });

    requestAnimationFrame(animatePackets);
}

sizePacketCanvas();
animatePackets();

window.addEventListener('resize', function () {
    sizePacketCanvas();
});

// ================================================================
// 13. PIPELINE PARTICLES (Dynamic creation)
// ================================================================
document.querySelectorAll('.pipeline').forEach(function (line) {
    ['', 'second'].forEach(function (name) {
        const particle = document.createElement('i');
        particle.className = 'pipeline-particle ' + name;
        particle.setAttribute('aria-hidden', 'true');
        line.appendChild(particle);
    });
});