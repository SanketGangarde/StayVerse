# StayVerse

StayVerse is a full-stack accommodation booking platform inspired by Airbnb. Users can browse listings, create and manage properties, book stays, make secure payments (Razorpay test mode), leave reviews, and interact with a community forum.

---

## Live Demo

(Deployed URL placeholder) — https://stayverse-1.onrender.com/listings

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

- Frontend: EJS, Bootstrap, CSS, JavaScript
- Backend: Node.js, Express.js (MVC architecture)
- Database: MongoDB (Mongoose)
- Authentication: Passport.js
- Payments: Razorpay (test mode)
- Images: Cloudinary
- Maps: Map integration (Mapbox or similar)

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

```bash
# development
npm run dev
# or
node app.js
```

Open http://localhost:3000 (or your configured PORT) in your browser.

---

## Environment Variables (.env example)

Create a `.env` file with values for your environment. Example keys used by the app:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stayverse
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

- Your Name — https://github.com/SanketGangarde

If you'd like to include contact details or a short bio, replace the placeholders above.

---



Thank you for using StayVerse — a clean, extensible foundation for an accommodation booking platform.
