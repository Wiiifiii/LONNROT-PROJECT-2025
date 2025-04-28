import cron from 'node-cron'; // Import node-cron to schedule tasks
import 'dotenv/config'; // Load environment variables from .env file
import { main } from './importBooks.js'; // Import the main function from importBooks.js

async function runImportBooks() {
  console.log(`Starting import at ${new Date().toISOString()}…`); // Log the start time of the import process
  try {
    await main(); // Execute the importBooks main function
    console.log(`Import succeeded at ${new Date().toISOString()}`); // Log success time if import succeeds
  } catch (err) {
    console.error(`Import failed at ${new Date().toISOString()}:`, err); // Log any errors that occur during import
  }
}

cron.schedule('0 0 * * *', runImportBooks); // Schedule runImportBooks to run daily at midnight

if (process.argv.includes('--run-now')) {
  runImportBooks(); // Immediately run import if '--run-now' argument is provided
}
