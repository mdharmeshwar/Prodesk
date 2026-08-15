# Prompt Notes

A few of the key prompts used while working through Sprint 14, written in a more natural project-note style rather than formal AI task language.

## Starting point
I first checked the repository to understand what was already in place and what architecture the app was actually using. The goal was to build on the existing structure rather than replacing it with something unrelated.

## Architecture decision
The project clearly fit a full-stack Track B setup, so I focused on a real Express + MongoDB authentication flow instead of trying to force a different stack. That meant wiring up the auth API, session flow, and protected route logic in a way that matched the project’s backend/frontend split.

## Auth implementation
I worked on the actual registration and login flow, making sure the app handled validation, password hashing, duplicate accounts, and JWT creation properly. The login response needed to return only the user identity and token required by the client, without exposing sensitive fields.

## Protected access
Once the auth flow was working, I moved to route protection and session validation. The dashboard needed to reject unauthenticated users and redirect them to login, and the API also needed to reject invalid or expired tokens properly.

## UI and product polish
After the authentication system was functioning, I improved the product around it with a more premium design language, better form states, cleaner layout, and a more intentional dashboard experience. The goal was to keep the app feeling like a real product instead of a generic starter template.

## QA and verification
I validated the app by checking the lint and build output, then confirming the auth flow worked in practice: register, login, access protected content, and logout. The final step was making sure the project was deployment-ready rather than only visually complete.
