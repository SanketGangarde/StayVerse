# StayVerse

StayVerse is a full‑stack accommodation marketplace built to connect hosts and guests with a polished, end‑to‑end booking experience. The application uses a modular Express.js backend with EJS server-side rendering to deliver fast, SEO‑friendly pages and maintainable routing and controller layers. Hosts can create, edit, and manage listings with images, descriptions, amenities, and availability; guests can search with filters, view results on an interactive map, read ratings and reviews, and complete secure bookings. The booking flow is integrated with Razorpay for payment capture and confirmation, producing booking records and checkout receipts. Role‑based dashboards provide personalized views for guests, hosts, and admins—supporting profile management, booking history, listing moderation, and review administration. The codebase emphasizes separation of concerns (routes, controllers, models, middleware, utilities) with robust error handling and async wrappers to keep request flow reliable. Public assets include responsive CSS and client-side JavaScript for seamless user interactions (search bar, maps, star ratings, and dynamic form behavior). Centralized configuration and modular utilities make it straightforward to adapt the app for scaling, adding calendar availability, messaging, or analytics. StayVerse is well suited as a production‑grade app or learning project that demonstrates practical patterns in web app architecture, secure payment integration, role management, and user experience for marketplace workflows.

---

## Live Demo

Deployed URL  — https://stayverse-1.onrender.com/

---

## Features

- User authentication: sign up, log in, log out
- Role-based dashboards: Guest and Host views with role-appropriate actions
- Listing management: create, edit, delete property listings with image uploads (Cloudinary)
- Booking flow: search listings, select dates, checkout
- Payment integration: Razorpay (test mode) for secure payments
- Reviews & ratings: guests can leave feedback after stays
- Search: keyword and location-based search
- Community forum and helpful footer pages (privacy, terms, safety, responsible hosting, etc.)
- Flash messages for user feedback and robust error handling middleware
- Responsive UI built with EJS, Bootstrap, and custom CSS

---

## Tech Stack

- Frontend: EJS,HTML, Bootstrap, CSS, JavaScript
- Backend: Node.js, Express.js (MVC architecture)
- Database: MongoDB (Mongoose)
- Authentication: Passport.js
- Payments: Razorpay (test mode)
- Images: Cloudinary
- Maps: Map integration (Mapbox)

---

## Installation

Follow these steps to run StayVerse locally.

1. Clone the repository

```bash
git clone https://github.com/your-username/StayVerse.git
cd StayVerse
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root (see example below)

4. Start the app


5. node app.js
```

Open http://localhost:8080 (or your configured PORT) in your browser.

---

## Environment Variables (.env example)

Create a `.env` file with values for your environment. Example keys used by the app:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:8080/listings
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_test_secret
MAPBOX_TOKEN=your_mapbox_token
```

Do not commit your `.env` to source control.

---

## Folder Structure (high level)

- `app.js` — application entrypoint
- `routes/` — Express routes by feature
- `controllers/` — request handlers and business logic
- `models/` — Mongoose models (User, Listing, Review, Booking)
- `views/` — EJS templates and layouts
- `public/` — static assets (css, js, images)
- `utils/`, `middleware.js`, `config/` — helpers, middleware, and configuration

This project follows a simple MVC separation to keep concerns clear and testable.

---

## Screenshots

Include screenshots of key pages (placeholders below):

- Homepage / listings — screenshots/homepage.png
- Listing detail — screenshots/listing-detail.png
- Booking & checkout — screenshots/checkout.png
- Host dashboard — screenshots/host-dashboard.png

(Replace these placeholders with actual images in a `screenshots/` folder.)

---

## Future Improvements


- CI/CD pipeline and deployment instructions (Heroku / Vercel / Docker)
- Production-grade payment handling with webhooks and reconciliations
- Enhanced search with filters and geospatial queries
- Image optimization and progressive loading
- Real-time chat between guests and hosts
- Rate limiting, input sanitization hardening, and security audits

---

## Author

- Sanket Gahininath Gangarde — https://github.com/SanketGangarde
- gmail - sgangarde747@gmail.com

---



Thank you for using StayVerse — a clean, extensible foundation for an accommodation booking platform.
