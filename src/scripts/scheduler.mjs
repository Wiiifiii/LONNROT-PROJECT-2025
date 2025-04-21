import cron from 'node-cron';
import 'dotenv/config';         // ← now works
import { main } from './importBooks.js';

async function runImportBooks() {
  console.log(`Starting import at ${new Date().toISOString()}…`);
  try {
    await main();
    console.log(`Import succeeded at ${new Date().toISOString()}`);
  } catch (err) {
    console.error(`Import failed at ${new Date().toISOString()}:`, err);
  }
}

cron.schedule('0 0 * * *', runImportBooks);

if (process.argv.includes('--run-now')) {
  runImportBooks();
}
