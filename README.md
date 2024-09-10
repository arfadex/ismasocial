# ismasocial

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/arfadex/ismasocial.git
cd ismasocial
```

2. **Backend Setup:**

```bash
cd backend
# Install dependencies
npm install
# Create a .env file based on .env.example and configure MongoDB connection
cp .env.example .env
```

3. **Frontend Setup:**

```bash
cd ../client
# Install dependencies
npm install
```

4. **Running Locally:**

   - Start the backend server:

```bash
cd ../backend
npm start
```

   - Start the frontend server:

```bash
cd ../client
npm start
```

   - Access the application at `http://localhost:3000`.

## Deployment

### Using Docker Compose

1. **Build and Run with [Docker Compose](docker-compose.yml):**

   Ensure Docker and Docker Compose are installed.

```bash
docker-compose up -d --build
```

   This command builds and starts the backend, frontend, and MongoDB containers defined in `docker-compose.yml`.

   Access the application at `http://localhost`.
### Without Docker Compose

1. **Backend Deployment:**

   - Set up MongoDB and update `.env` with your MongoDB URL.
   - Start the backend server:

```bash
cd backend
npm install --only=production
npm start
```

2. **Frontend Deployment:**

   - Build the frontend:

```bash
cd client
npm install
npm run build
```

   - Serve the built frontend files using a static server like `serve`:

```bash
npm install -g serve
serve -s build -l 3000
```

   Access the application at `http://localhost:3000`.

## Todos

- [ ] Add an admin dashboard.
- [ ] Add support for videos.
- [ ] Implement chat functionality.

### Note

Don't forget to configure your `.env` file (`backend/.env`) with the MongoDB URL, port, and JWT secret before running the application.

### License

This project is licensed under the GPL-3.0 License. See the LICENSE file for details.

### Contributing

Contributions are welcome! Please fork this repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.
