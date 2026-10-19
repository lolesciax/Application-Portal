# Job Application Portal

A React and Express case-study application for applicant registration, resume submission, application review, and interview scheduling. It is separate from Solarisiot.com.

## Local setup

Requires Node.js 20 or newer and a MongoDB database.

1. In server, run npm install. Create an ignored .env file with MONGODB_URI, JWT_SECRET (a strong random value), and optionally PORT (default 5000).
2. In server, run npm run dev.
3. In client, run npm install. Copy .env.example to .env if you need a different API URL.
4. In client, run npm start. Open http://localhost:3000.

REACT_APP_API_URL defaults to http://localhost:5000/api. Restart the client after changing it.

## Accounts

Registration creates an engineer/applicant account. Administrators must have a real database account with role set to admin. All accounts sign in through the backend; there is no hardcoded administrator bypass.

## Validation

In client:

- npm run build
- npm test -- --watchAll=false --runInBand

The Jest module mappings allow Create React App's Jest runner to resolve React Router 7's CommonJS entry points.

## Repository

The Git repository root is CASE-STUDY, with this application inside job-application-portal. The origin remote points to https://github.com/lolesciax/application-portal.git.

Keep .env, node_modules, resume uploads, and build output out of Git. The server stores uploaded resumes locally and requires persistent storage when deployed.
