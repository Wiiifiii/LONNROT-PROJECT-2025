// Summary: Schedules and manually triggers the importBooks script using node-cron and a command-line flag.
import cron from 'node-cron';
import { main } from '../scripts/importBooks.js';

async function runImportBooks() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting import books script...`);
  try {
    await main();
    console.log(`[${new Date().toISOString()}] Import completed successfully.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error during import:`, error);
  }
}

// Schedule the task to run every day at midnight (server time)
cron.schedule('0 0 * * *', runImportBooks);

// Allow manual execution via command line flag (e.g., "node tasks/scheduler.js --run-now")
if (process.argv.includes('--run-now')) {
  runImportBooks();
}
