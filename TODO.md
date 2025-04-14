# TO-DO

This document outlines the planned improvements and enhancements for the Lönnrot project.

---

## Admin Dashboard Enhancements

### User Management & Reviews
- **Admin Page for User Management:**
  - Create a dedicated admin page (e.g., `/admin/users`) to view, edit, and delete user accounts.
  - Display a list of users with details (name, email, profile image).
  - Enable clicking into a detailed view for individual users.
- **Review Moderation:**
  - Develop a section where admins can view, moderate, and manage user reviews.
  - Include options to approve or remove inappropriate content.
- **Reading List Management:**
  - Build a component displaying users' reading lists with options for editing and deletion.
  
---

## PDF Storage & Generation Improvements

### Cloud Storage Integration for PDFs
- Update the frontend to retrieve PDF URLs from a cloud storage service (e.g., AWS S3 or Azure Blob Storage).
  - Configure environment variables in the Next.js app with the cloud storage endpoints.
  - Adjust the API to fetch PDFs from external storage in production environments.

### Enhanced PDF Styling
- Evaluate and integrate a more advanced PDF generation library (e.g., PDFKit or advanced features within PDF-lib) for better styling.
- Update the PDF viewing/downloading UI to showcase the enhanced styled PDFs.

---

## Public-Facing Content & Filtering

### Book Organization
- **Book Genres & Publication Years:**
  - Create UI components to display books organized by genre and publication year.
  - Integrate filtering options for users to view books within specific genres or time ranges.
- **Dynamic Collections:**
  - Implement sections such as "Most Downloaded," "Trending," and "Recently Uploaded" books.
  - Design visually balanced components (e.g., card layouts or carousel sliders) for displaying collections.
- **Arrangement by Writers:**
  - Develop a filter or grouping mechanism that allows users to sort or group books by writer.
  - Ensure each group is visually distinct for improved navigation.

---

## Community & Interactive Features

### Chat and Discussion Areas
- Integrate a discussion board or live chat feature where users can discuss books and share opinions.
- Consider implementing real-time communication using WebSockets or third-party services like Firebase Realtime Database/Firestore.
- Design a dedicated section on book detail pages for comments and discussions to foster community interaction.

---

## User Profile Enhancements

- **Enhanced Profiles:**
  - Update the user profile page to support profile image uploads (e.g., an avatar upload option).
  - Incorporate components for users to crop and preview their images before saving.
  - Improve layout and styling on the profile page to prominently display user details alongside reading history or reviews.

---

## Implementation Notes

- **Responsiveness & Symmetry:**
  - Ensure that the layout in every section is responsive using grid or flexbox designs.
  - Maintain consistent image dimensions and aligned text blocks across different devices.

- **API Integration:**
  - Verify that all frontend components fetch data from the correct backend endpoints.
  - Ensure API requests and responses between the frontend and backend are consistent.

- **Styling & Consistency:**
  - Utilize Tailwind CSS (or your preferred styling framework) to maintain a uniform look and feel.
  - Update classes as needed to ensure consistent spacing, alignment, and overall design cohesion.