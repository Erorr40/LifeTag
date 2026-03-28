<p align="center">
  <h1 align="center">LifeTag 🏥📱</h1>
  <p align="center">
    <strong>Your Smart Companion for Medical Emergencies</strong>
    <br/>
    Bridging the gap between physical NFC accessories and digital life-saving profiles.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" alt="React Vite" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-success?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 📖 About The Project

**LifeTag** is a comprehensive, mobile-first web application designed to act as the primary interface for smart, NFC-enabled emergency tags (like smart bracelets, medical cards, or keychains). 

In critical medical emergencies where every second counts, paramedics or first responders can simply tap the user's physical LifeTag with their phone to instantly access crucial medical data—such as blood type, severe allergies, chronic conditions, and emergency contacts. 

LifeTag ensures that users have total control over their data, wrapped in an elegant and easy-to-navigate user interface, whilst providing a dedicated, clean, read-only emergency view for incredibly fast access.

## ✨ Key Features

- **🔐 Interactive Authentication Flow:** Secure sign-in and sign-up with session persistence using localized storage bridging to cloud profiles.
- **❤️ Comprehensive Medical Profiles:** Store, manage, and instantly update:
  - Blood Type & Age
  - Medical Conditions
  - Medications & Dosages
  - Allergies
  - Custom Medical Notes
- **📞 Emergency Contacts:** Easily add friends, family, or doctors to your emergency speed-dial list.
- **⌚ Smart NFC Tag Linking:** A sleek, animated synchronization process that links your physical device (Smart Bracelet/Card) to your digital profile seamlessly. Keeps track of your linked accessories right from the Settings.
- **🛡️ PIN Protection:** Optional security layer. First responders might be required to input a designated PIN code to unlock sensitive data.
- **🚑 Public Emergency View:** A specifically tailored screen designed to be visually distinct (highlighted with urgent red accents) that quickly delivers life-saving information to whoever scans the tag.
- **📱 True Mobile-First Experience:** A UI/UX deliberately crafted to look and feel exactly like a native mobile app on any smartphone browser.

## 🏗️ Architecture & Technology Stack

The project operates on a modern full **MERN** stack variation:

### 🎨 Frontend
- **React.js & Vite:** Blazing fast UI rendering and build times.
- **TypeScript:** Ensuring type safety and robust code across the application.
- **Tailwind CSS:** Utility-first styling utilized strictly to build a mobile-first, clean, modern UI.
- **Lucide React:** Sleek & professional SVG icons.
- **React Router DOM:** Smooth and dynamic single-page application routing without page reloads.

### ⚙️ Backend
- **Node.js & Express.js:** Lightweight and incredibly fast API routing for handling medical data.
- **Mongoose & MongoDB:** Flexible NoSQL database schema capable of handling dynamic arrays of medical conditions and personal details.
- **CORS & Body-Parser:** Secure cross-origin communications between the frontend client and the backend server.

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- A running local MongoDB instance OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI.

### 2. Backend Setup
Initialize the core server and connect to the database:
```bash
cd Backend
npm install
# Ensure your MongoDB is running or configure the URI in src/index.ts
npm run dev
```
> The backend runs on `http://localhost:3001`

### 3. Frontend Setup
Launch the visual frontend interface:
```bash
cd Frontend
npm install
npm run dev
```
> The frontend runs on `http://localhost:5173`

### 💡 Pro Tip for Viewing
For the ultimate experience that matches the design intentions, open the frontend app in your browser, press `F12` to open Developer Tools, and click the **Device Toolbar (Responsive Design Mode)** to emulate a mobile phone (e.g., iPhone 12 Pro / Galaxy S20).

---

## 👨‍💻 Developed By

**Ahmed Raafat**  
*Built with passion, clean code, and a core mission to save lives using technology.*