/* ================================================================
   SCRIPT.JS – Temperature Converter
   ================================================================ */

// ================================================================
// 1. DOM REFERENCES
// ================================================================
const tempInput = document.getElementById('temp-input');
const converterForm = document.getElementById('converter-form');
const validationMessage = document.getElementById('validation-message');
const zeroWarning = document.getElementById('zero-warning');
const thermometer = document.getElementById('thermometer');
const thermometerFill = document.getElementById('thermometer-fill');
const thermoValue = document.getElementById('thermo-value');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const resultElements = {
    C: document.getElementById('result-celsius'),
    F: document.getElementById('result-fahrenheit'),
    K: document.getElementById('result-kelvin')
};

const absoluteZero = { C: -273.15, F: -459.67, K: 0 };
const units = { C: '°C', F: '°F', K: 'K' };

// ================================================================
// 2. HELPER FUNCTIONS
// ================================================================
function formatResult(value, unit) {
    if (!Number.isFinite(value)) {
        return '— <span class="unit">' + units[unit] + '</span>';
    }
    return value.toFixed(2) + ' <span class="unit">' + units[unit] + '</span>';
}

function setResults(celsius, fahrenheit, kelvin) {
    resultElements.C.innerHTML = formatResult(celsius, 'C');
    resultElements.F.innerHTML = formatResult(fahrenheit, 'F');
    resultElements.K.innerHTML = formatResult(kelvin, 'K');
}

function getSelectedUnit() {
    return document.querySelector('input[name="unit"]:checked').value;
}

function convertTemperature(value, sourceUnit) {
    var celsius;
    if (sourceUnit === 'C') celsius = value;
    if (sourceUnit === 'F') celsius = (value - 32) * 5 / 9;
    if (sourceUnit === 'K') celsius = value - 273.15;
    return {
        celsius: celsius,
        fahrenheit: (celsius * 9 / 5) + 32,
        kelvin: celsius + 273.15
    };
}

// ================================================================
// 3. THERMOMETER UPDATE
// ================================================================
function updateThermometer(celsius, sourceUnit) {
    var safeCelsius = Number.isFinite(celsius) ? celsius : 25;
    var clampedRatio = Math.max(0, Math.min(1, (safeCelsius + 50) / 150));
    var color, mode;

    if (safeCelsius < 0) {
        color = '#00E5FF';
        mode = 'cold';
    } else if (safeCelsius <= 30) {
        color = '#00FFAA';
        mode = 'mild';
    } else {
        color = '#FF6B00';
        mode = 'hot';
    }

    document.body.dataset.temperature = mode;
    thermometer.style.setProperty('--thermo-color', color);
    thermometerFill.style.setProperty('--thermo-color', color);
    thermometerFill.style.setProperty('--fill-size', Math.max(4, clampedRatio * 100) + '%');
    thermoValue.textContent = safeCelsius.toFixed(2) + '°';
    document.querySelector('.readout-unit').textContent = 'Celsius scale • from ' + sourceUnit;
    thermometer.setAttribute('aria-label', 'Temperature gauge reading ' + safeCelsius.toFixed(2) + ' degrees Celsius');
}

// ================================================================
// 4. CLEAR RESULTS
// ================================================================
function clearResults() {
    setResults(NaN, NaN, NaN);
    zeroWarning.classList.remove('visible');
    tempInput.setAttribute('aria-invalid', 'true');
    updateThermometer(25, getSelectedUnit());
}

// ================================================================
// 5. MAIN CONVERSION FUNCTION
// ================================================================
function updateConversion() {
    var rawValue = tempInput.value.trim();
    var sourceUnit = getSelectedUnit();

    validationMessage.classList.remove('visible');
    zeroWarning.classList.remove('visible');
    tempInput.removeAttribute('aria-invalid');

    if (rawValue === '' || !Number.isFinite(Number(rawValue))) {
        clearResults();
        validationMessage.classList.add('visible');
        return;
    }

    var value = Number(rawValue);
    if (value < absoluteZero[sourceUnit]) {
        clearResults();
        validationMessage.classList.remove('visible');
        zeroWarning.classList.add('visible');
        return;
    }

    var converted = convertTemperature(value, sourceUnit);
    setResults(converted.celsius, converted.fahrenheit, converted.kelvin);
    updateThermometer(converted.celsius, sourceUnit);
}

// ================================================================
// 6. THEME TOGGLE (with localStorage persistence)
// ================================================================
function toggleTheme() {
    var isLight = document.body.classList.toggle('light-mode');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeLabel.innerHTML = isLight ?
        '<i class="fas fa-sun"></i> Light mode' :
        '<i class="fas fa-moon"></i> Dark mode';
    localStorage.setItem('temperature-theme', isLight ? 'light' : 'dark');
}

// ================================================================
// 7. EVENT LISTENERS
// ================================================================
tempInput.addEventListener('input', updateConversion);
document.querySelectorAll('input[name="unit"]').forEach(function(radio) {
    radio.addEventListener('change', updateConversion);
});

converterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    updateConversion();
});

themeToggle.addEventListener('click', toggleTheme);

// ================================================================
// 8. INITIALIZATION
// ================================================================
if (localStorage.getItem('temperature-theme') === 'light') {
    toggleTheme();
}

document.getElementById('current-year').textContent = new Date().getFullYear();
tempInput.focus();
updateConversion();