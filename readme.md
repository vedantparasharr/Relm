# Relm — Minimal Social Blogging App
hhhhh
A small, opinionated social/blogging web app built with Node.js, Express and MongoDB. Relm provides user accounts, email verification, guest sessions, post creation, likes, comments, profile pages and image uploads (Supabase).

This README gives a quick project overview, setup instructions, and notes on important implementation details so you (or a reviewer) can run and extend the app quickly.

---

## Table of contents

* [Demo](#demo)
* [Key features](#key-features)
* [Tech stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment variables](#environment-variables)
* [Run locally](#run-locally)
* [Project structure (high level)](#project-structure-high-level)
* [Routes & controllers (summary)](#routes--controllers-summary)
* [Auth & security notes](#auth--security-notes)
* [Development tips](#development-tips)
* [Contributing](#contributing)
* [License](#license)

---

## Demo

No hosted demo included in this repo. Follow the setup steps below to run the app locally.

---

## Key features

* Email-based signup with OTP verification and password reset
* Guest sessions (temporary JWT cookie)
* Post creation, edit, delete
* Commenting and comment deletion (author-only)
* Like / unlike mechanism for posts
* Profile and about pages
* Image uploads (Supabase storage)
* Minimal EJS-powered views for server-side rendering

---

## Tech stack

* Node.js + Express
* MongoDB (Mongoose)
* EJS templates for views
* JWT for session/auth
* bcrypt for password hashing
* Supabase storage for file uploads
* dayjs for date formatting

---

## Prerequisites

* Node.js (v18+ recommended)
* npm or pnpm
* A running MongoDB instance (Atlas or local)
* Supabase project (optional, required if you use image upload)
* An SMTP or email provider for sending OTPs (or a development email transporter)

---

## Installation

```bash
# clone the repo
git clone <repo-url>
cd <repo-directory>

# install dependencies
npm install
```

Create a `.env` file in the project root (see required keys in the next section).

---

## Environment variables

Example `.env` (adjust names to match your deployment provider):

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/relm?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=your_anon_key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=supersecret
```

**Behavioral notes**

* `JWT_SECRET` is used to sign cookies/tokens — keep it secret and strong.
* If you don't configure Supabase, image upload routes will still run but fail when an upload happens.

---

## Run locally

Start the app in development:

```bash
# development start
npm run dev

# or production start (after building / preparing env)
npm start
```

Open `http://localhost:3000` (or the `PORT` you configured).

---

## Project structure (high level)

```
├── app.js                # Express app setup (routes, middleware)
├── server.js             # Server entry (loads env and starts app)
├── src/
│   ├── controllers/      # All route handlers (auth, profile, posts)
│   ├── models/           # Mongoose models (User, Post...)
│   ├── routes/           # Route definitions
│   ├── utils/            # Helpers (upload, email, etc.)
│   └── views/            # EJS templates
├── public/               # Static assets
└── README.md
```

This project intentionally groups domain logic into `controllers` and `routes` so controllers can be easily unit-tested.

---

## Routes & controllers (summary)

Below are the main routes and their responsibilities. This is a short map — open the `src/controllers` and `src/routes` directories for exact implementations.

* `GET /` — Landing page (redirects to `/home` for authenticated users)

* `GET /home` — Home timeline (protected)

* Auth routes (`/auth`)

  * `GET /auth/signup`, `POST /auth/signup`
  * `GET /auth/signin`, `POST /auth/signin`
  * `POST /auth/verify` — verify OTP
  * `POST /auth/guest` — creates temporary guest JWT cookie
  * `POST /auth/forget` — sends OTP for reset
  * `POST /auth/reset/:user` — perform password reset
  * `GET /auth/signout` — clears token cookie

* Profile routes (`/profile`)

  * Profile page, edit, settings, about
  * Uploads and username validation

* Post routes (`/posts`)

  * Create, view, edit, delete posts
  * Add / delete comments
  * Like / unlike posts (returns JSON)

---

## Auth & security notes

* Passwords are hashed with `bcrypt` before storage.
* Account verification and password reset use OTPs hashed with bcrypt in the DB (compare with bcrypt.compare).
* JWTs are set as `httpOnly` cookies to reduce XSS risk. Consider `SameSite=Strict` for tighter CSRF protection if your UI is single-origin.
* Guest sessions use short-lived tokens (1 hour) and do not map to persisted user documents.

**Recommendations**

* Rate limit OTP/email endpoints (to prevent abuse).
* Limit repeated failed OTP attempts and lock or throttle accordingly.
* Consider rotating JWT secrets if a secret leak is suspected.
* Use HTTPS in production and set `secure: true` on cookies.

---

## Development tips

* Consolidate repeated `findById(req.user.userId)` patterns into middleware to reduce duplication and centralize error handling.
* Move OTP generation + validation into a dedicated service for better testability.
* Cache heavy queries if pages become slow (Redis or similar).
* Use a single DB operation to toggle likes (optimistic toggling) if you want fewer round trips.

---

## Contributing

Feel free to open issues or PRs. Keep changes small, add tests for new behaviors, and follow the existing code style.

---

## License

This project has no license file in the repo by default. Add a `LICENSE` file or change the following line if you want an open-source license:

```
MIT License
```

---

## Final notes

This README is intended to help you get started and to explain key implementation choices. If you want, I can also:

* Create a `.env.example` file
* Add a Postman collection for core API flows
* Suggest unit tests and provide a testing scaffold

Happy hacking — ship fast, iterate often.
