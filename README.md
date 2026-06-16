# 🔐 PassMan

**PassMan** is a secure, client-side password manager built with modern web technologies. It features a stunning glassmorphism UI, zero-knowledge architecture, and blazing-fast performance.

## ✨ Features

- **Robust Encryption:** Utilizes the native Web Crypto API with PBKDF2 key derivation (100,000 iterations) and AES-CBC encryption.
- **Zero-Knowledge Architecture:** Your master password and session keys are never saved to disk. All credentials stay strictly encrypted in your local browser storage.
- **Beautiful UI/UX:** A fully responsive, modern glassmorphism design powered by Tailwind CSS and Radix UI primitives.
- **Keyboard Navigation:** Fully keyboard-accessible form inputs for rapid credential entry.
- **Copy to Clipboard:** One-click copy functionality for your usernames, URLs, and passwords.

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **UI Components:** Shadcn UI + Radix UI Primitives
- **Styling:** Tailwind CSS + `tailwind-merge` + `clsx`
- **State & Forms:** React Hook Form + Zod Validation
- **Icons & Animations:** Lucide React & LordIcon
- **Utilities:** `uuid` (unique ID generation), `sonner` (toast notifications)
- **Cryptography:** Native Web Crypto API

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

## 🔒 Security Notice

**PassMan is entirely local.** 
There is no backend server or cloud sync. If you clear your browser's `localStorage` or forget your Master Password, **your credentials cannot be recovered.** The cryptographic design ensures that without the exact Master Password and the dynamic salt, the ciphertext is mathematically impossible to decrypt.

---
*Built with ❤️ using React, Tailwind CSS, and the Web Crypto API.*
