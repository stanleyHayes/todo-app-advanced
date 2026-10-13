# todo-app-advanced

todo app advanced is an application containing JavaScript. The checked-in dependency manifests use Express, MongoDB via Mongoose. Source modules cover `authentication`, `todos`, `users`, `Todo`, `User`.

## Repository layout

- `config/` — 1 tracked file(s); source examples: `config/db.js`.
- `controllers/` — 3 tracked file(s); source examples: `controllers/authentication.js`, `controllers/todos.js`.
- `middlewares/` — 4 tracked file(s); source examples: `middlewares/advancedResult.js`, `middlewares/async.js`.
- `models/` — 2 tracked file(s); source examples: `models/Todo.js`, `models/User.js`.
- `public/` — 2 tracked file(s).
- `routes/` — 3 tracked file(s); source examples: `routes/authentication.js`, `routes/todos.js`.
- `utils/` — 2 tracked file(s); source examples: `utils/errorResponse.js`, `utils/sendEmail.js`.

## Local setup

Run each package setup block from the repository root. For workspace repositories, install dependencies at the root before running application-specific scripts.

Clone this repository and enter its directory:

```sh
git clone https://github.com/stanleyHayes/todo-app-advanced.git
cd todo-app-advanced
```

### Node package: `package.json`

Use Node.js and npm.

```sh
npm install
```

- `npm run dev` — runs the declared `dev` script (`nodemon server`).
- `npm run start` — runs the declared `start` script (`NODE_=PRODUCTION node server`).
- The package test script is a placeholder and exits with an error; it does not run an automated test suite.

## Configuration

The application declares `dotenv`. Review environment-variable references in the source and supply your own local values before starting it. Keep credentials out of Git; do not reuse committed credentials.

## Source entry points

- [config/db.js](config/db.js)
- [controllers/authentication.js](controllers/authentication.js)
- [controllers/todos.js](controllers/todos.js)
- [controllers/users.js](controllers/users.js)
- [middlewares/advancedResult.js](middlewares/advancedResult.js)
- [middlewares/async.js](middlewares/async.js)
- [middlewares/authentication.js](middlewares/authentication.js)
- [middlewares/error.js](middlewares/error.js)

## Development notes

Commands above come from the tracked manifests and source layout. External services and runtime configuration may be required. Documentation updates do not establish that the application is deployed or that its tests pass.
