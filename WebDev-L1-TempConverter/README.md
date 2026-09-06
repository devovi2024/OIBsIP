# 🌡️ Temperature Converter — Live Conversion Tool

> Convert Celsius, Fahrenheit, and Kelvin in real-time with a live visual thermometer.

---

## 📌 Project at a Glance

| Item | Description |
|------|-------------|
| **Project Type** | Interactive Web Application |
| **Tech Stack** | HTML5, CSS3, Vanilla JavaScript, Font Awesome 6 |
| **Key Feature** | Live conversion with visual thermometer feedback |
| **Status** | ✅ Fully functional |

---

## 🎯 What It Does

- Takes a numeric temperature input from the user.
- Lets the user choose the source unit (Celsius, Fahrenheit, or Kelvin).
- Instantly converts and displays the equivalent values in all three units.
- Shows a live, color-coded thermometer that responds to the temperature value.
- Handles edge cases like empty input, non-numeric values, and absolute zero.

---

## ✨ Standout Features

| Feature | Description |
|---------|-------------|
| 🌓 **Dark / Light Mode** | Toggle themes with persistent user preference (localStorage) |
| 🌡️ **Live Thermometer** | Visual gauge that updates in real-time with color changes (blue → green → orange) |
| ⚡ **Instant Conversion** | No button-click required — updates as you type |
| 🎨 **Dynamic Background** | The page glow shifts based on temperature (cold / mild / hot) |
| 🧠 **Absolute Zero Guard** | Prevents values below -273.15°C, -459.67°F, or 0K with a clear warning |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile devices |

---

## 🧮 Conversion Logic

| From → To | Formula |
|-----------|---------|
| Celsius → Fahrenheit | `(C × 9/5) + 32` |
| Celsius → Kelvin | `C + 273.15` |
| Fahrenheit → Celsius | `(F − 32) × 5/9` |
| Fahrenheit → Kelvin | `(F − 32) × 5/9 + 273.15` |
| Kelvin → Celsius | `K − 273.15` |
| Kelvin → Fahrenheit | `(K − 273.15) × 9/5 + 32` |

> All conversions are normalized through Celsius as an intermediate unit.

---

## 🎨 Design System

### Color Palette (Dynamic)

| Temperature Range | Thermometer Color | Page Glow |
|-------------------|-------------------|-----------|
| Below 0°C | Cyan `#00E5FF` | Cool Blue |
| 0°C – 30°C | Green `#00FFAA` | Mild Mint |
| Above 30°C | Orange `#FF6B00` | Warm Amber |

### Typography

- **UI Text**: `'Inter'` — clean, modern, readable.
- **Numbers & Code**: `'JetBrains Mono'` — precise and technical.

---



1. Clone the repository or download the files.
2. Open `index.html` in any modern browser.
3. No server or build tools required — it's a static web page.

```bash
# Clone the repo
git clone https://github.com/your-username/OIBsIP.git

# Navigate to the project folder
cd OIBsIP/WebDev-L1-TempConverter

# Open in browser (macOS)
open index.html

# Open in browser (Windows)
start index.html