# Embedded Projector Control;er  WebApp

A web-based control center interface for managing a Raspberry Pi-4B based projector control system. This application provides real-time control and monitoring capabilities through WebSocket communication.

## Overview

This project is part of a capstone's embedded projector board control system. The control center provides an intuitive web interface for adjusting projector settings and monitoring system status.

## Features

- Real-time projector control via WebSocket connection
- Image settings adjustment (brightness, contrast)
- Test pattern generation
- Color correction tools
- System reset options
- Connection status monitoring
- Factory reset capability

## Technical Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Network Protocol**: WebSocket (Default: raspberry.pi.local:8080)
- **Additional Libraries**:
  - radix-ui components
  - lucide-react
  - react/react-dom

## Components

### UI Components
- Alert
- Button
- Card
- Slider
- Tabs

### Feature Components
- ImageControls
- ResetOptions
- StatusAlert
- SystemInfo

## Communication Protocol

The application uses string-based commands for WebSocket communication. Example commands:

```
brightness 50
contrast 75
test pattern
color correction
reset
image settings
factory reset
```

## State Management

Connection state is handled by a custom `useNetworkConnection` hook that manages:
- WebSocket connections
- Error states
- Automatic reconnection

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the WebSocket connection in the environment settings
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Status

- **Status**: In Progress
