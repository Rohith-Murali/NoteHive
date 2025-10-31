# NoteHive

NoteHive is a personal notes & tasks web application with a Node/Express + MongoDB backend and a React + Tailwind frontend. This README explains how to run the project locally, the folder layout, environment variables, and a few developer notes specific to this repository.

---

## Repo structure

- backend/
	- src/
		- server.js           # Express app entry
		- config/
		- controllers/
		- middleware/
		- models/
		- routes/
		- services/
		- utils/
	- package.json

- frontend/
	- public/
	- src/
		- app/                # store, top-level wiring
		- components/         # shared React components
		- features/           # feature folders (auth etc.)
		- pages/              # route pages
		- services/           # axios instance etc.
		- utils/              # small helpers
	- package.json
	- tailwind.config.js

---

## Requirements

- Node.js (v18+ recommended)
- npm (comes with Node) or yarn
- MongoDB (local or cloud Atlas)

Note: the instructions below assume you're using the default Windows shell (cmd.exe). If you're on macOS/Linux or using PowerShell, adjust commands accordingly.

---

## Environment variables

Create a `.env` file in `backend/` with at least the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/notehive
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
```

Adjust values to your environment (for example, if using MongoDB Atlas provide the connection string). Do NOT commit secrets to source control.

---

## Install & run (development)

1. Backend

Open a terminal and run:

```cmd
cd c:\RM\Projects\NoteHive\backend
npm install
npm run dev
```

- `npm run dev` uses `nodemon` to restart on file changes. The server entrypoint is `src/server.js`.

2. Frontend

In a separate terminal run:

```cmd
cd c:\RM\Projects\NoteHive\frontend
npm install
npm start
```

- This starts the React app (Create React App tooling / react-scripts).
- If you modify `tailwind.config.js` or Tailwind-related config, restart the frontend dev server so Tailwind regenerates the CSS.

---

## Build (production)

- Backend: ensure `NODE_ENV=production` and run `node src/server.js` (or use a process manager like PM2).
- Frontend: build static assets

```cmd
cd frontend
npm run build
```

Serve the `build/` folder contents from any static host or integrate with the backend as desired.

---

## Notes & developer tips

- Auth persistence: The frontend stores a `user` object and access/refresh tokens in `localStorage`. If you experience `user` being `null` after reload, check `Application → Local Storage` in browser devtools to confirm the stored value and ensure the login response contains the user object.

- Theme variables and Tailwind: The project uses CSS variables for theme colors and maps a subset of Tailwind utilities to those variables. After changing `tailwind.config.js`, restart the frontend dev server to apply changes.

- Icons: The project uses `react-icons` for iconography. If you need to swap icon sets, search for imports like `react-icons/fi` or `react-icons/bs`.

- Code formatting: The repository currently does not enforce a formatter in git hooks. Please follow the existing code style when contributing.

- Tests: There are no automated test suites included by default. If you add tests, update `package.json` scripts so CI can run them.

---

## Troubleshooting

- "User becomes null on reload": ensure `localStorage.user` is a valid JSON object. The app code expects a parsed object; if the localStorage value is the literal string `"null"` or malformed JSON, the reducer will clear it and the user will appear logged out.

- "Tailwind changes not visible": restart the frontend dev server after editing `tailwind.config.js`.

- CORS / API errors: confirm backend `PORT` and that the frontend's axios base URL points to the correct server. See `frontend/src/services/axios.js` for the configured base URL.

---

## Contributing

- Create a branch from `development` for your feature/fix.
- Open a pull request and include a brief description and screenshots where applicable.

---

## Optional improvements (ideas)

- Migrate auth persistence to `redux-persist` for more robust state rehydration.
- Add E2E tests (Cypress) for critical flows (signup/login, note CRUD, task toggling).
- Replace remaining hard-coded color hex values with theme variables for full dark-mode coverage.

---

## License

This repository does not contain a license file. Add one (e.g., MIT) if you want to make the project open source.

---

If you'd like, I can also generate a `.env.example` file, wire up `redux-persist` for the `auth` slice, or create a short CONTRIBUTING.md. Which would you prefer next?
