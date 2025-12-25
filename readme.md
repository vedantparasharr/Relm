# Relm - Simple Community App ✨🚀🌐

A small, opinionated social/community app built with **Node.js**, **Express**, **MongoDB** and **Supabase** (for avatar uploads). It’s intentionally simple - focused on user accounts, basic posts, likes, and profile management. 🌱🧩💡

---

## Highlights ⭐📌🎯

- Email/password authentication with JWT stored in an HTTP-only cookie
- Guest sign-in (temporary token)
- Create / edit / delete posts
- Like/unlike posts (AJAX-friendly endpoint)
- Profile editing with avatar upload to Supabase storage
- Simple EJS views and server-side rendering

---

## Tech stack 🛠️⚙️📦

- Node.js + Express
- MongoDB (Mongoose)
- Supabase Storage (for avatar uploads)
- EJS templates
- Multer for multipart/form-data uploads
- bcrypt for password hashing
- jsonwebtoken for auth tokens
- sharp for image resizing

---

## Prerequisites 📋✅🔧

- Node.js (v16+ recommended)
- A running MongoDB instance (URI)
- A Supabase project with a storage bucket (see below)

---

## Quick start 🚀🧭⚡

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

2. Create a `.env` file in the project root with the following values:

```env
MONGO_URI=your_mongo_uri
JWT_SECRET=some_long_secret
SUPABASE_URL=https://your-supabase-url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

3. Start the app:

```bash
# production
node index.js

# development (if you use nodemon)
npx nodemon index.js
```

The server will listen on `http://localhost:3000` (or the value of `PORT`). 🌍🔊🕒

---

## Important environment details 🔐🧠📎

- `JWT_SECRET` - used to sign tokens. Keep it secret.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - used to upload avatars to Supabase storage.
- The code expects a Supabase storage bucket named exactly: `avatars relm` (make sure that bucket exists and is publicly readable if you want direct public URLs).

---

## Routes overview (main ones) 🧭🛣️📡

- `GET /` - Landing page
- `POST /createUser` - Create account (multipart form; accepts `image` file)
- `GET /auth/guest` - Create a temporary guest token (expires in 1 hour)
- `GET /auth/signin` & `POST /auth/signin` - Sign-in form and handler
- `GET /auth/signout` - Clear cookie and sign out
- `GET /profile` - Protected route (view your profile)
- `POST /profile/edit` - Edit profile (multipart; `image` optional)
- `GET /posts/new` - New post form
- `POST /posts` - Create a post
- `GET /posts/:id` - View a post
- `POST /posts/:id/like` - Toggle like (returns JSON `{ liked, likesCount }`)

**Note:** Most protected routes require the JWT cookie (`token`). ⚠️🍪🔑

---

## File structure (relevant files) 🗂️📁🧱

```
/ (root)
├─ index.js                # main server file (express app)
├─ configs/
│  ├─ supabase.js          # supabase client
│  └─ multer.js            # multer config
├─ models/
│  ├─ userModel.js
│  └─ postModel.js
├─ utils/
│  ├─ uploadToSupabase.js  # upload helper
│  └─ compressAvatar.js    # sharp image resizing
├─ public/                 # static assets
├─ views/                  # EJS templates
└─ package.json
```

---

## Supabase setup ☁️🗄️🔗

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Create a storage bucket named `avatars relm`.
3. Ensure uploaded files are readable (public) or adapt `getPublicUrl` usage to your security needs.
4. Copy the project URL and anon key into `.env`.

---

## Notes & tips 📝💡🧠

- The app stores JWT tokens in an HTTP-only cookie named `token`.
- Guest accounts are created via `/auth/guest` and use a token containing `data: randomId` (no persisted user document). Guests cannot access `/profile`.
- Password changes are handled in `/profile/settings` - the server checks the current password before updating.
- Image uploads are compressed to 256×256 and saved as JPEG via `sharp` before uploading to Supabase.

---

## Example `curl` (create user) 🧪📮🖥️

```bash
curl -X POST \
  -F "username=alice" \
  -F "name=Alice" \
  -F "email=alice@example.com" \
  -F "password=supersecret" \
  -F "image=@/path/to/avatar.jpg" \
  http://localhost:3000/createUser
```

**Sign in** (form-based; you can POST `email` and `password` to `/auth/signin`). 🔐➡️👤

---

## Contributing 🤝🌱🛠️

This project is intentionally small - PRs are welcome for bug fixes, small features, and documentation improvements. 🙌📖✨

---

## License 📄⚖️✔️

MIT

---

## Author 👤💼✨

Built with ❤️ by **Vedant Parasharr** ✨🚀  
Connect on LinkedIn: https://www.linkedin.com/in/vedantparasharr

