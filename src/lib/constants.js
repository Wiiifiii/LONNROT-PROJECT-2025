// src/lib/constants.js
// This file exports an object representing different types of user interactions.
// You can either export these constants directly from Prisma or recreate the enum here if needed.
export const InteractionType = {
  DOWNLOAD: 'DOWNLOAD', // Represents a download interaction
  READ_START: 'READ_START', // Represents the start of reading an item
  READ_FINISH: 'READ_FINISH', // Represents the finish of reading an item
  EXTRACT: 'EXTRACT', // Represents an extraction action (e.g., extracting content)
  REVIEW: "REVIEW", // Represents a review interaction
};
