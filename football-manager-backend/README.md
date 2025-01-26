### Backend Setup

1. **Install the backend dependencies**:
    ```bash
    npm install
    ```

2. **Set up the environment variables**:
    - Create a `.env` file in the `backend` directory.
    - Add the necessary environment variables, including the local MySQL database credentials. Example `.env` configuration:

    ```env
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=football_manager_db
    JWT_SECRET=your_jwt_secret
    ```

    - Replace `your_username`, `your_password`, and `your_jwt_secret` with your actual MySQL credentials and secret key.

3. **Set up the MySQL database**:
    - Ensure you have MySQL installed and running locally.
    - Create a database with the name specified in `.env` (e.g., `football_manager_db`):
    ```bash
    mysql -u your_username -p
    CREATE DATABASE football_manager_db;
    ```

4. **Start the backend server**:
    ```bash
    npm run dev
    ```

    - The backend server will run at `http://localhost:3001` (or any port specified in your `.env` file).
