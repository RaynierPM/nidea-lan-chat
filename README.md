# Nidea LAN Chat

A LAN chat application built with Electron, React, and TypeScript.

## Development

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn package manager

### Installation

```bash
yarn install
```

### Development Commands

```bash
# Start development server
yarn dev

# Type checking
yarn typecheck

# Build for development
yarn build

# Preview built application
yarn preview
```

## Building for Distribution

This project is configured to build distributable applications for Windows, Linux, and macOS using `electron-builder`.

### Build Commands

```bash
# Build for Windows
yarn build:win

# Build for Linux
yarn build:linux

# Build for macOS
yarn build:mac

# Build for all platforms
yarn build:all
```

### Build Outputs

The built applications will be available in the `dist/` directory:

#### Windows
- **NSIS Installer**: `dist/Nidea LAN Chat Setup.exe`
- **Portable**: `dist/Nidea LAN Chat.exe`

#### Linux
- **AppImage**: `dist/Nidea LAN Chat.AppImage`
- **Debian Package**: `dist/nidea-lan-chat_1.0.0_amd64.deb`
- **RPM Package**: `dist/nidea-lan-chat-1.0.0.x86_64.rpm`

#### macOS
- **DMG**: `dist/Nidea LAN Chat.dmg`
- **ZIP**: `dist/Nidea LAN Chat-mac.zip`

### Build Configuration

The build configuration is defined in the `build` section of `package.json`:

- **App ID**: `com.nidea.lan-chat`
- **Product Name**: `Nidea LAN Chat`
- **Output Directory**: `dist/`

### Platform-Specific Notes

#### Windows
- Builds for x64 architecture
- Creates both installer and portable versions
- NSIS installer allows custom installation directory

#### Linux
- Builds for x64 architecture
- Creates AppImage, Debian, and RPM packages
- Categorized as "Network" application

#### macOS
- Builds for both x64 and ARM64 (Apple Silicon) architectures
- Creates DMG installer and ZIP archive
- Categorized as "Social Networking" application

## Project Structure

```
nidea-lan-chat/
├── client/          # CLI client
├── common/          # Shared code and interfaces
├── electron/        # Electron application
│   ├── main/        # Main process
│   ├── preload/     # Preload scripts
│   └── renderer/    # Renderer process (React app)
├── server/          # Chat server
└── dist/            # Build output (generated)
```
## Images

![Main page image](https://raw.githubusercontent.com/RaynierPM/nidea-lan-chat/refs/heads/main/readme-images/nidea-lan-chat-main-page.png)

![Search rooms](https://raw.githubusercontent.com/RaynierPM/nidea-lan-chat/refs/heads/main/readme-images/nidea-lan-chat.png)

![Chat room](https://raw.githubusercontent.com/RaynierPM/nidea-lan-chat/refs/heads/main/readme-images/nidea-lan-chat-room.png)


## License

MIT License - see [LICENSE](LICENSE) file for details. 
