# Live Editor with React, Quill, and Socket.IO

This project is a collaborative text editor built using React, Quill, and Socket.IO. It allows multiple users to simultaneously edit a document in real-time, with changes instantly reflected across all connected clients. The frontend is developed using Vite with React, providing a fast and efficient development environment.

## Demo

#### Spinning up containers

<image src="https://raw.githubusercontent.com/nimish-kumar/live-editor/master/demo/images/spinning-up-containers.gif" width="667" height="223" />

#### Testing on local
They share the same URL, but modifications occur exclusively on one of them.

<image src="https://raw.githubusercontent.com/nimish-kumar/live-editor/master/demo/images/live-editor-run.gif" width="950" height="450" />

#### Cleanup

<image src="https://raw.githubusercontent.com/nimish-kumar/live-editor/master/demo/images/destroying-containers.gif" width="667" height="223" />

## Table of Contents

- [Live Editor with React, Quill, and Socket.IO](#live-editor-with-react-quill-and-socketio)
  - [Demo](#demo)
      - [Spinning up containers](#spinning-up-containers)
      - [Testing on local](#testing-on-local)
      - [Cleanup](#cleanup)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Usage Guidelines](#usage-guidelines)
  - [Contributing](#contributing)
    - [Prerequisites](#prerequisites-1)
    - [Environment Variables](#environment-variables)
    - [Running development server](#running-development-server)

## Features
- **Real-time Collaboration**: Multiple users can collaborate and edit the same document in real-time.
- **Rich Text Editing**: The Quill editor allows for easy and intuitive rich text editing.
- **Efficient Development**: The frontend is built with Vite and React, providing a fast and efficient development environment.
- **Socket.IO Integration**: Socket.IO is used for handling real-time communication between clients.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v20.9.0+): [Download and install Node.js](https://nodejs.org/) [ONLY FOR DEVELOPMENT]
- Docker: [Download and install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Download and install Docker Compose](https://docs.docker.com/compose/install/)

### Usage Guidelines
1. Clone the repository:

   ```bash
   git clone https://github.com/nimish-kumar/live-editor
   ```
2. To start the containers, ensure you are at the project's root directory and execute the following command:
    ```bash
    docker compose -f docker-compose.dev.yaml up
    ```
    You can append `-d` flag to run the containers in `detached mode`.
     ```bash
    docker compose -f docker-compose.dev.yaml up -d
    ```

3. Once you see serving message, follow the link to get started.
4. To halt the containers, terminate the process in the terminal using `Ctrl+C`. To remove the containers, ensure you are at the project's root directory and execute the following command:
    ```bash
    docker compose -f docker-compose.dev.yaml down
    ```
5. Ensure you clear all Docker images and rebuild them, along with the containers, in case there are code changes. To remove existing images, use the following commands:
    ```bash
    docker image remove live-editor-client
    docker image remove live-editor-server
    ```

## Contributing

We welcome contributions to enhance and improve this project! Follow the steps below to get started:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Environment Variables
Create a .env file in root directory and add the following variables:

```.env
PROJ_SERVER_PORT=8001
PROJ_CLIENT_PORT=5173
PROJ_DEPLOYED_SERVER_URL=http://localhost:${PROJ_SERVER_PORT}
PROJ_DB_CONNECTION_STRING=mongodb://localhost:27017/editor-db
PROJ_DEPLOYED_FRONTEND_URL=http://localhost:${PROJ_CLIENT_PORT}
```

### Running development server
1. Start MongoDB container:
   ```bash
   docker run -d -p 27017:27017 -v ~/mongodb:/data/db --name live-editor mongo:7.0.3
   ```
2. Switch to client/server folder. To install packages:
    ```bash
    pnpm install
    ```
3. To run server/client:
    ```bash
    pnpm run dev
    ```

