# 🗳️ VoteNavigator AI — Bharat Ka Election Assistant

![VoteNavigator Cover](https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2070&auto=format&fit=crop)

**VoteNavigator AI** is a production-grade, AI-powered civic assistant designed to help Indian citizens navigate the electoral process with ease. From registering for your first **EPIC (Voter ID)** to finding your polling booth and understanding **NOTA** or **EVM/VVPAT** systems, VoteNavigator provides personalized, real-time guidance tailored to the Indian electoral context.

## ✨ Features

- **🇮🇳 India-First Localization:** Built specifically for the Indian electoral system with support for all 28 States and 8 Union Territories.
- **🤖 Gemini AI Integration:** Uses Google Gemini 2.0 Flash to generate personalized voter journeys and accurate election timelines.
- **🔐 Secure Authentication:** Firebase-powered login and signup with Google OAuth support and live password strength validation.
- **📅 Smart Timeline Generator:** Instantly generate a schedule for upcoming Lok Sabha, Vidhan Sabha, or Municipal elections based on ECI norms.
- **💬 Smart Civic FAQ:** A real-time AI chat assistant to answer complex questions about Form 6/8, Model Code of Conduct (MCC), and more.
- **💎 Premium Glassmorphism UI:** A stunning "Deep Space Neon" theme with smooth Framer Motion animations and responsive design.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **AI:** [Google Gemini 2.0 Flash API](https://ai.google.dev/)
- **Backend/Auth:** [Firebase (Authentication & Firestore)](https://firebase.google.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** [Google Cloud Run](https://cloud.google.com/run) via Firebase Hosting

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd vote-navigator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Deployment

This project is configured for **Firebase Hosting with Framework support**, which automatically deploys the Next.js app to **Google Cloud Run**.

```bash
# Login to Firebase
npx firebase login

# Initialize (if not already done)
npx firebase init

# Deploy to Production
npx firebase deploy
```

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── api/              # AI Generation Endpoints (Journey, Timeline, FAQ)
│   ├── login/            # Auth: Login Page
│   ├── signup/           # Auth: Signup Page
│   ├── journey/          # Feature: Personalized Voter Roadmap
│   ├── timeline/         # Feature: Election Calendar Generator
│   └── faq/              # Feature: AI Chat Assistant
├── components/           # Reusable UI Components (Navbar, UI elements)
├── lib/                  # Library Config (Firebase, AuthContext)
└── styles/               # Global Design System & Tokens
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---
*Built with ❤️ for a more informed democracy.*
