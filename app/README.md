# DataLens
A modern, production-ready corporate employee directory dashboard built with React 18 and Vite. Features advanced datatable controls, interactive geographical mapping, dynamic salary data visualization, secure webcam integration, global dark mode, and seamless framer-motion transitions.

## 🚀 Features
- **User Authentication:** Dummy login system with route protection and session persistence.
- **Advanced Directory:** Interactive employee list with debounced search, active sorting, and responsive client-side pagination.
- **Identity Verification:** Profile detail view equipped with react-webcam for real-time ID verification and photo capture.
- **Interactive Map:** Leaflet-powered geographical heatmap showing workforce distribution across India.
- **Salary Analytics:** Live Recharts visualization of the top 10 employee compensations.
- **Global Theme Support:** System-synced or manually togglable Dark/Light mode powered by Tailwind CSS.
- **Polished UI/UX:** Built with glassmorphism design patterns, Framer Motion page transitions, and React Hot Toast notifications.

## 💻 Tech Stack
- **Framework:** React 18, Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (with native dark mode strategy)
- **State Management:** Context API (AuthContext, ThemeContext)
- **Data Visualization:** Recharts, Leaflet / React-Leaflet
- **Hardware Integration:** React-Webcam
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios (fetching from remote PHP backend)
- **Icons:** Lucide React

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd DataLens/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Login Credentials (Dummy)
- **Username:** `testuser`
- **Password:** `Test123`

## 📁 Project Structure
```text
src/
├── components/
│   ├── layout/       # Navbar and structural components
│   └── ...           # Reusable UI pieces (ProtectedRoute, loaders)
├── context/          # Global state (AuthContext, ThemeContext)
├── hooks/            # Custom React hooks (useDebounce)
├── pages/            # Application views (Login, List, Details, Photo, Chart, Map)
├── index.css         # Global Tailwind directives & glass utilities
└── App.jsx           # Main router & Provider wrappers
```

## 🌐 API Reference
The application fetches mock internal directory data from a live remote testing endpoint:
- `POST https://backend.jotish.in/backend_dev/gettabledata.php`
