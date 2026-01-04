# AG-NES Emulator

A modern, web-based NES emulator built with React and Nostalgist.js.

[**Play Now**](https://tjw2005.github.io/ag-nes/)

## Features

- 🕹️ **Full NES Emulation**: Powered by Nostalgist.js and the stable FCEUmm core.
- 📂 **Drag & Drop Loading**: Simply drag your `.nes` ROM files anywhere on the screen to start playing.
- 🎮 **Gamepad Support**: Plug and play controller support.
- 💾 **Save States**: Download your progress as `.state` files and resume later.
- 🖥️ **Fullscreen Mode**: Immersive gaming experience.
- 🎨 **Modern UI**: Sleek interface with glassmorphism styling that stays out of your way.

## Controls

### Keyboard
| Key | Action |
| --- | --- |
| **Arrow Keys** | D-Pad |
| **X** | A Button |
| **Z** | B Button |
| **Enter** | Start |
| **Shift** | Select |

### Gamepad
Most USB/Bluetooth controllers are detected automatically.
- **D-Pad / Left Stick**: Movement
- **A / B / X / Y**: Action Buttons
- **Start / Select**: Start / Select

## Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/tjw2005/ag-nes.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

## Credits

This project was built using **Antigravity** by Google DeepMind.

- **Engine**: [Nostalgist.js](https://github.com/retrobox/nostalgist)
- **Framework**: React + Vite
