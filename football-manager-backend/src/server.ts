import app from './app';
import { connectToDatabase } from './configs/dbConfig';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
})();
