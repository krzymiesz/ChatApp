# Chat App – Real-time Chat Application with Group & Private Rooms

A modern real-time chat application built with **Next.js** and **Socket.IO**, where users can join group chat rooms by entering a username and room ID, see online users, and initiate private conversations with other connected users. Private chats open in a modal window and are completely isolated from the group chat.

## Features

- **Join group chat rooms** – Choose a username and a room ID to start chatting.
- **Online users list** – See who is currently online (appears only after joining a room).
- **Real-time messaging** – Messages are delivered instantly via WebSockets.
- **Private chats** – Start a private conversation with any online user.  
  - Invitations are sent, and the recipient can accept or decline.  
  - Private chats open in a modal and have their own independent room ID.  
  - Messages in private chats do not appear in the group chat.
- **User-friendly interface** – Left sidebar with online users, right area for the main chat or join form.
- **Typing area** – Send messages with a simple form.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, CSS Modules  
- **Backend:** Node.js, Socket.IO  
- **Communication:** WebSockets (Socket.IO client & server)

---

## Getting Started

### Prerequisites

Make sure that you have **Node.js** and **npm** installed.

## Installation


***Setting Up the Project***
### 1. Create a new project using Next.js with TypeScript.

	npx create-next-app chat-app

When prompted:
* Would you like to use the recommended Next.js defaults? » **No, customize settings**
* Would you like to use TypeScript? » **Yes**
* Which linter would you like to use? » **None**
* Would you like to use React Compiler? » **Yes**
* Would you like to use Tailwind CSS? ... **No**
* Would you like your code inside a `src/` directory? ... **Yes**
* Would you like to use App Router? (recommended) ... **Yes**
* Would you like to customize the import alias (`@/*` by default)? ... **Yes**
* What import alias would you like configured? ... @/*
* Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? ... **No**

A new **Next.js** project will be created with ***TypeScript***.
---

### 2. Go to the newly created project directory and run:
	```bash
	npm install socket.io socket.io-client @types/socket.io
---

### 3. Copy the necessary files from the https://github.com/krzymiesz/ChatApp repository:

* `server.js` into the root of the project. This will be the Socket.io server.
* `chat.module.css`, `page.tsx` and `Sidebar.tsx` into the **src/component** folder.
* replace src/app/`page.tsx` with the same file from the repository.
* replace src/app/`page.module.css` with the same file from the repository.
---

### 4. package.json file

In the **package.json** file add **"node": "node server.js"** in the scripts part

	"scripts":  {
	"dev":  "next dev",
	"build":  "next build",
	"start":  "next start",
	"lint":  "next lint",
	"node":  "node server.js"
	},
---

## Run the Application

In Terminal 1 (Backend):


	npm run node

In Terminal 2 (Frontend):

	npm run dev

---

## Usage

### 1. Open the application in two or more browser windows (or different devices).
### 2. Enter a **Username** and a **Room id** (any string, e.g., `general`).
### 3. Click **Join** – after a short spinner, the chat interface appears.
### 4. In the left sidebar, you'll see a list of online users (only after joining).
### 5. **Group chat**: Type a message and press **Send** – all users in the same room will see it.
### 6. Start a **private chat**: Click the **"Chat"** button next to any online user. An invitation is sent, and you'll see a confirmation modal.
### 7. **Accept an invitation**: When someone invites you, a modal appears – click **Accept**. A **Private Chat** modal opens.
### 8. In the private chat modal, messages are only visible to the two participants.

---
---

## Future Improvements

### * Persistent message history (store messages in a database)
### * Typing indicators
### * Notifications for new messages
### * Multiple rooms per user (switch between rooms)
### * User avatars / profile pictures
### * End-to-end encryption for private chats