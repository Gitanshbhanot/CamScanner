# 📹 Camera Scanner - RTSP Camera Discovery Tool

<div align="center">

![Camera Scanner](https://img.shields.io/badge/Electron-28.2.1-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.16.4-007FFF?style=for-the-badge&logo=mui&logoColor=white)

**A powerful desktop application for discovering and managing RTSP cameras on your network**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Development](#-development) • [Building](#-building) • [License](#-license)

</div>

---

## 🌟 Features

### 🔍 **Intelligent Network Scanning**
- **Automatic Network Detection**: Automatically detects all available network interfaces on your system
- **Smart IP Range Calculation**: Calculates usable IP ranges based on subnet masks
- **Manual Range Override**: Option to specify custom IP ranges for targeted scanning
- **Multi-Network Support**: Scan across multiple network interfaces simultaneously

### 📡 **ONVIF & RTSP Support**
- **ONVIF Discovery**: Leverages ONVIF protocol for automatic camera discovery
- **RTSP Stream Detection**: Identifies and validates RTSP streaming endpoints
- **Authentication Support**: Handles username/password authentication for secured cameras
- **Hardware Identification**: Detects camera manufacturer and hardware information

### 💼 **Professional UI/UX**
- **Modern Material Design**: Clean, intuitive interface built with Material-UI
- **Real-time Progress**: Animated loading states with entertaining status messages
- **Responsive Layout**: Optimized for various screen sizes
- **Dark Mode Ready**: Gradient background with professional aesthetics

### 📊 **Results Management**
- **Detailed Results Table**: View discovered cameras with IP, hardware, manufacturer, and RTSP links
- **CSV Export**: Download discovery results as CSV for documentation
- **One-Click Stream Access**: Open RTSP streams directly from the results table
- **Comprehensive Logging**: Automatic logging of all discovery operations

### 🔒 **Security & Reliability**
- **Secure Credential Handling**: Password masking and secure transmission
- **Error Handling**: Comprehensive error boundaries and validation
- **Auto-Updates**: Built-in support for automatic application updates
- **Cross-Platform**: Works on macOS and Windows

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git** (for cloning the repository)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CameraScanElectron.git
cd CameraScanElectron
```

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install script dependencies
cd scripts
npm install
cd ..
```

### 3. Environment Setup

Create a `.env.development.local` file in the root directory (if needed):

```env
# Add any environment-specific variables here
```

---

## 💻 Usage

### Running in Development Mode

```bash
# Start the Vite dev server and Electron app
npm run electron:start
```

This will:
1. Start the Vite development server on `http://localhost:3000`
2. Wait for the server to be ready
3. Launch the Electron application with DevTools enabled

### Using the Application

1. **Select Network Interface**
   - The app automatically detects available network interfaces
   - Choose the network you want to scan from the dropdown

2. **Configure Credentials** (Optional)
   - Enter camera username and password if your cameras require authentication
   - Toggle "Use ONVIF" for ONVIF-compatible cameras

3. **Set Scan Range**
   - Use automatic range (based on selected network)
   - Or enable "Manual Scanning" to specify custom IP ranges

4. **Discover Cameras**
   - Click "Discover Cameras" to start the scan
   - Watch the animated progress indicator
   - View results in the table once scanning completes

5. **Export Results**
   - Click the download icon to export results as CSV
   - Click on camera links to open RTSP streams

---

## 🛠️ Development

### Project Structure

```
CameraScanElectron/
├── src/                      # React source files
│   ├── App.jsx              # Main application component
│   ├── modules/             # Feature modules
│   │   └── Home.jsx         # Camera discovery UI
│   ├── Common/              # Shared components
│   ├── util/                # Utility functions and routes
│   └── Lotties/             # Animation files
├── scripts/                 # Node.js scripts
│   ├── rtsp-discovery.js    # Camera discovery logic
│   └── notarize.js          # macOS notarization
├── public/                  # Static assets
├── electron-main.js         # Electron main process
├── preload.js              # Electron preload script
└── package.json            # Project dependencies
```

### Available Scripts

```bash
# Development
npm start                    # Start Vite dev server
npm run electron:start       # Start Electron with dev server

# Building
npm run build               # Build React app for production
npm run electron-build      # Package Electron app

# Preview
npm run serve               # Preview production build
```

### Key Technologies

- **Frontend**: React 18, Material-UI, TailwindCSS, Framer Motion
- **Desktop**: Electron 28, electron-builder
- **Build Tool**: Vite 5
- **Network**: node-onvif, axios
- **State Management**: React Hooks
- **Routing**: React Router DOM

---

## 📦 Building

### Build for Production

```bash
# Build the React application
npm run build

# Package the Electron app
npm run electron-build
```

This will create distributable packages in the `dist/` directory.

### Platform-Specific Builds

The app is configured to build for:
- **macOS**: DMG installer (with code signing and notarization support)
- **Windows**: NSIS installer

### macOS Specific Setup

After installing the application on macOS, you may need to disable Gatekeeper:

```bash
xattr -d com.apple.quarantine /Applications/Camera\ Search.app
```

---

## 🔧 Configuration

### Electron Builder Configuration

The build configuration in `package.json` includes:

- **App ID**: `com.demo.camsearch`
- **Product Name**: Camera Search
- **Icons**: Platform-specific icons in `public/`
- **Extra Resources**: Scripts bundled with the app
- **Code Signing**: Configured for macOS (requires certificates)

### Environment Variables

The application supports environment-based configuration through `.env` files:

- `.env.development.local` - Development environment
- `.env.production.local` - Production environment

---

## 📝 Logging

Discovery logs are automatically saved to:

```
~/Documents/RTSPDiscoveryLogs/discovery_[timestamp].log
```

Each scan creates a new log file with detailed information about the discovery process.

---

## 🐛 Troubleshooting

### No Cameras Found

If the scan completes but no cameras are found:

1. ✅ Verify camera credentials are correct
2. ✅ Ensure cameras are powered on and connected to the network
3. ✅ Try a different IP range
4. ✅ Toggle the ONVIF setting
5. ✅ Check firewall settings on your computer

### Application Won't Start

1. ✅ Ensure all dependencies are installed (`npm install`)
2. ✅ Check that Node.js version is 16 or higher
3. ✅ Try deleting `node_modules` and reinstalling
4. ✅ Check the logs in `~/Library/Logs/Camera Search/` (macOS)

### Build Errors

1. ✅ Ensure you've run `npm run build` before `npm run electron-build`
2. ✅ Check that all dependencies in `scripts/` are installed
3. ✅ Verify that icon files exist in `public/`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Author

**Gitansh Bhanot**
- Email: gitanshbhanot86@gmail.com

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- Network discovery using [node-onvif](https://github.com/futomi/node-onvif)
- Animations by [Lottie](https://airbnb.design/lottie/)

---

<div align="center">

**Made with ❤️ using Electron and React**

</div>
