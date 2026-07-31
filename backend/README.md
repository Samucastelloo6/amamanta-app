# Amamanta API

Amamanta API is the backend service that powers the Amamanta Progressive Web App.

It provides a REST API for managing workshops, events, university nursing rooms, breastfeeding-friendly places, user feedback and administrator authentication. The application is built with Node.js, Express, TypeScript and MongoDB.

## Features

- REST API built with Express and TypeScript.
- CRUD operations for the application's resources.
- Administrator authentication using JSON Web Tokens (JWT).
- Password hashing with bcrypt.
- Request validation using Zod.
- MongoDB integration through Mongoose.
- Security middleware including Helmet, CORS and rate limiting.
- Database seed scripts for initial application data.

## Technologies

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Zod
- bcrypt

## Installation

Clone the repository:

```bash
git clone https://github.com/Samucastelloo6/amamanta-api.git
```

Go to the project directory:

```bash
cd amamanta-api
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file based on the `.env.example` template.

Build the project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable      | Description                |
| ------------- | -------------------------- |
| `NODE_ENV`    | Application environment.   |
| `PORT`        | Port used by the server.   |
| `MONGODB_URI` | MongoDB connection string. |
| `CLIENT_URL`  | Frontend application URL.  |

Example:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb_connection_string
CLIENT_URL=http://localhost:4200
```

## Available Scripts

| Command                         | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `npm run dev`                   | Starts the development server with hot reload. |
| `npm run build`                 | Compiles the TypeScript source code.           |
| `npm start`                     | Starts the production server.                  |
| `npm run typecheck`             | Runs the TypeScript type checker.              |
| `npm run admin:create`          | Creates an administrator account.              |
| `npm run seed:static`           | Seeds the static application data.             |
| `npm run seed:workshops`        | Seeds workshop data.                           |
| `npm run seed:friendly-spaces`  | Seeds breastfeeding-friendly places.           |
| `npm run seed:university-rooms` | Seeds university nursing rooms.                |
| `npm run seed:events`           | Seeds event data.                              |

## API Endpoints

| Resource                         | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| `/api/auth`                      | Administrator authentication.                   |
| `/api/events`                    | Manage events.                                  |
| `/api/workshops`                 | Manage workshops.                               |
| `/api/university-rooms`          | Manage university nursing rooms.                |
| `/api/hospitals`                 | Manage accredited hospitals.                    |
| `/api/friendly-space-categories` | Manage breastfeeding-friendly place categories. |
| `/api/friendly-spaces`           | Manage breastfeeding-friendly places.           |
| `/api/contact`                   | Manage contact requests.                        |
| `/api/collaborate`               | Manage collaboration requests.                  |
| `/api/feedback`                  | Manage user feedback.                           |
| `/api/experiences`               | Manage user experiences.                        |
| `/api/analytics`                 | Retrieve application statistics.                |

## Project Structure

```text
src/
├── config/
├── middlewares/
├── modules/
│   ├── analytics/
│   ├── auth/
│   ├── collaborate/
│   ├── contact/
│   ├── events/
│   ├── experiences/
│   ├── feedback/
│   ├── friendly-space-categories/
│   ├── friendly-spaces/
│   ├── hospitals/
│   ├── university-rooms/
│   └── workshops/
├── scripts/
├── shared/
├── app.ts
└── server.ts


## Deployment

The API is deployed on Northflank and uses MongoDB Atlas as the database.


## Related Repository

Frontend:

<https://github.com/Samucastelloo6/amamanta-app>


## Author

Developed by Samuel Castelló Felipe.
```
