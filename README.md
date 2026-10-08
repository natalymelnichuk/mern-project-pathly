
# 🗺️ Pathly — Smart Travel Planning & Task Management Platform

Pathly is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to help users plan trips, track travel activities and budget, manage task schedules, and visualize locations seamlessly.


## Live Demo & Deployment

* **Frontend Application**: [https://pathly-frontend-8iou.onrender.com]
* **Backend API Base**: [https://mern-project-pathly.onrender.com/api]


## Tech Stack

### Frontend
* **Core Framework**: React.js, TypeScript, Vite
* **Routing**: React Router
* **State & Data Fetching**: React Context API, Axios
* **UI & Styling**: Tailwind CSS, Lucide React Icons
* **Interactive Components**: `@hello-pangea/dnd` (Drag-and-Drop)

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB & Mongoose ODM
* **Security & Auth**: JSON Web Tokens (JWT), Bcrypt.js, CORS Middleware

### Cloud Infrastructure & Deployment
* **Client Hosting**: Render (Static Site with SPA Rewrite Rules)
* **API Hosting**: Render (Web Service)
* **Database Cloud**: MongoDB Atlas



## ✨ Key Features & User Capabilities

### 🔐 1. User Authentication & Authorization
* **Secure Registration & Login**: Account creation and authentication backed by **bcrypt** password hashing and **JSON Web Tokens (JWT)**.
* **Persistent Sessions & Auth State**: Global authentication context managing session state with secure token persistence in `localStorage`.
* **Protected Client & Server Routes**: Frontend route wrappers preventing unauthorized navigation, complemented by Express middleware verifying JWT headers on all protected API endpoints.

### ✈️ 2. Comprehensive Trip Management (Full CRUD)
* **Create Itineraries**: Plan new trips with title, destination, target start/end dates, budget estimates.
* **Read & Overview Dashboard**: Centralized dashboard displaying user-specific trips with visual progress, date ranges, and status badges.
* **Update Trip Details**: Real-time updating of itinerary schedules, destination targets, and trip parameters.
* **Delete Trips**: Safe removal of entire trip itineraries along with their associated activities and tasks.

### 📌 3. Activity & Custom Category Management (Full CRUD)
* **Detailed Activity Creation**: Add specific activities to any trip (e.g., museum visits, dining, flight departures) with title, category, scheduled date, location, and status.
* **Custom Category Lifecycle (Full CRUD)**:
  * **Create Categories**: Users can define custom categories with personalized titles.
  * **Delete Categories**: Remove categories with safe fallback/reassignment options for attached activities.
* **Category Filtering**: Dynamically filter activities by standard or custom-created categories across daily timelines.
* **Status Tracking**: Mark activities as *To Do*, *In Progress*, or *Completed*.
* **Activity Edit & Delete**: Complete flexibility to modify activity details or clear scheduled items as plans evolve.

### 🔀 4. Interactive Drag-and-Drop Reordering
* **Intuitive Kanban / Timeline Interface**: Powered by `@hello-pangea/dnd` for smooth, responsive user interactions.
* **Reorder Itinerary Items**: Drag and rearrange activities to seamlessly reorder daily travel schedules.
* **Status Updates via Dragging**: Effortlessly move tasks between different schedule columns.

### 🗺️ 5. Visualization & Map Integration
* **Interactive Map View**: Embedded interactive map displaying destination markers for scheduled activities and trip stops.
* **Location Pinning**: Geographic placement of itinerary stops to visualize daily travel routes and proximity between planned events.
* **Route Context**: Enhanced clarity helping users optimize travel time and geographical transitions during trips.

### 🌓 6. Dark / Light Mode Support
* **Theme Toggle**: One-click switching between Light and Dark visual modes.
* **Persistent Theme Preference**: User's chosen theme is saved (e.g., via `localStorage` or React Context) to maintain consistency across sessions and page reloads.
* **Seamless Tailwind Styling**: Fully responsive contrast and accessible color palettes optimized for both bright daytime environments and low-light night viewing.

### 📱 7. Fully Responsive Mobile-First Design
* **Cross-Device Compatibility**: Seamless user experience across mobile phones, laptops, and wide desktop monitors.
* **Adaptive Layouts**: Flexible grid and flexbox structures, collapsing sidebars, touch-friendly navigation controls, and mobile-optimized drag-and-drop interactions.
