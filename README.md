
# Database User Manual
![alt text](dbdiagram.png)

This document describes how to connect to our Azure PostgreSQL database and explains the database schema used in our project.

## 1. Connecting to the Database

### Using pgAdmin

Each team member can use [pgAdmin](https://www.pgadmin.org/) to connect to the database. Follow these steps:

1. **Install pgAdmin** on your local machine. (If you use winget -> terminal(as admin) -> "winget install PostgreSQL.pgAdmin" (without ""))
2. **Open pgAdmin** and create a new server registration:
   - **Name:** (Any name you prefer, e.g., `Project Database`)
   - **Connection Details:**
     - **Host:** `lonnrot-dev-db.postgres.database.azure.com`
     - **Port:** `5432`
     - **Maintenance database:** `postgres`
     - **Username:** `lonnrotadmin`
     - **Password:** `Test1234!`
     - **SSL Mode:** Choose `prefer` (or `require` if our configuration enforces SSL).
3. **Save** the connection and connect to the server. You will then be able to browse the database schema, view tables, and run SQL queries.
4. **Configure Environment Variables**
  Create a .env file in the root directory of the project /lonnrot-project with the following lines:
  DATABASE_URL="postgresql://lonnrotadmin:Test1234%21@lonnrot-dev-db.postgres.database.azure.com:5432/postgres?sslmode=prefer"
  NEXTAUTH_SECRET=supersecretkey123
  NEXTAUTH_URL=http://localhost:3000



### Using Azure Cloud Shell

You can also connect via the Azure Cloud Shell:
1. Open the [Azure Cloud Shell](https://shell.azure.com/) in your browser.
2. If not already installed, install the PostgreSQL client:
   ```bash
   sudo apt-get update && sudo apt-get install -y postgresql-client
3. Connect using the following command:
  psql "postgresql://lonnrotadmin:Test1234%21@lonnrot-dev-db.postgres.database.azure.com:5432/postgres?sslmode=prefer"
2. Database Schema Overview
### The database consists of the following main entities:


### To get you going from azure repo page to get app running
1. Clone to visual studio from site easiest way to this imo.
2. You might not get all branches (lonnrot-project branch) VSCode -> source control -> ...
3. terminal -> cd lonnrot-project -> npm install
4. Add .env to lonnrot-project directory
5. content of .env can be found on discord -> programming (DATABASE_URL, NEXTA....)
    -To make user (you might have to run -> npx prisma generate, try without first)
    cd lonnrot-project -> node prisma/seed.js to run main() function to create your user. 
6. finally terminal cd lonnro... -> npm run dev -> browser -> localhost:3000
   and should work.


Tables
### books
id: Primary key.
title, author, description, file_name, file_url, cover_url: Basic information about the book.
upload_date: When the book was uploaded.
metadata: Additional JSON data about the book.
isDeleted: Boolean flag for soft deletion.
### users
id: Primary key.
username, email: User identification details. The email is unique.
password_hash: Stores the hashed password.
role: Indicates the user’s role (e.g., "user", "admin").
created_at, updated_at: Timestamps for record creation and modification.
### activity_logs
id: Primary key.
userId: References a user (nullable).
action: Description of the action performed.
bookId: References a book (nullable).
timestamp: When the action occurred.
details: Additional information about the activity.
### reviews
id: Primary key.
bookId: References the book being reviewed.
userId: References the reviewing user (nullable).
rating: Numeric rating (e.g., 1-5 stars).
comment: Textual review (optional).
createdAt, updatedAt: Timestamps.
### reading_lists
id: Primary key.
name: The name of the reading list (e.g., "My Favorites").
userId: References the owner user.
createdAt, updatedAt: Timestamps.
### reading_list_items
id: Primary key.
readingListId: References the associated reading list.
bookId: References the book in the reading list.
order: Optional field for ordering the books.
addedAt: When the book was added to the list.
Unique Constraint: Combination of readingListId and bookId must be unique.
### Relationships
1. Activity Logs
Each activity log may be associated with a User and/or a Book.
2. Reviews
Each review is linked to one Book and optionally to one User.
3. Reading Lists
Each reading list belongs to a single User.
4. Reading List Items
Acts as a join table between Reading Lists and Books for a many-to-many relationship.
Ensures that a book is not added more than once to the same reading list.

# User and Admin Access Overview

## Authentication and Roles

- **Registration:**  
  When a user registers via our website, they are created with the role `"user"`.
- **Admin Accounts:**  
  Admin accounts are seeded separately (see our seed script in `prisma/seed.js`). Only team members are granted admin privileges.
- **Promoting Users:**  
  Admins can promote existing users to admin via the admin dashboard or manually using Prisma Studio.

## Access to Application Features

- **Public Access:**  
  Anyone (even without logging in) can view and download books. The pages under `/books` and `/reading-lists` are public.
- **Protected Admin Routes:**  
  The `/admin` section is accessible only to users with the admin role. Non-admin users attempting to access these routes will be redirected to the login page.


  ## Packages Added

### react-syntax-highlighter

- **Purpose:**  
  This package has been added to provide syntax-highlighted code blocks in our API documentation page. It allows us to neatly display JSON examples (for GET, POST, PUT, DELETE endpoints) with proper formatting and the "tomorrow" theme for an enhanced developer experience.

- **Installation Command:**

  ```bash
  npm install react-syntax-highlighter --legacy-peer-deps
  ```

### react-image-lightbox

- **Purpose:**  
  This package has been included to support an interactive image lightbox feature. It enables users to click on diagrams and logos in our Documentation and About pages to open them in a larger, zoomable popup window—improving the overall usability and presentation of the images.

- **Installation Command:**

  ```bash
  npm install react-image-lightbox --legacy-peer-deps
  ```

> **Note:**  
> These changes result in updates to the `package-lock.json` file. Please ensure you commit the updated lock file along with your changes.
