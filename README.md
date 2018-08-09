Assumptions
- We think, that all functionality should be available only for authorised users. However, we don't complete a visible module to login/signup, because it would take aditional time. We can add this later.
- Based on the previous point, we use JWT for users, because we think that this is a fastest way to indentify a user

Tech stack (front end & backend)
- frontend:
React
- backend:
Node.js, Restify, MongoDB, Mongoose

Prerquisites
- Node v.8.11.3
- Docker v.18.06.0-ce
- npm v5.6.0
- Mac OS v.10.13.6

How to install
- `npm install`
- `npm run start:db` wait when before it's completely started
- `npm run start:server`
- `npm run start`

How to test
- `npm run test:integration`
- `npm run test:client`
