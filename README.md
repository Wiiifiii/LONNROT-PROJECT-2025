## Heroku Environment Setup

To retrieve your database URL from Heroku, run the following command:

```
heroku config:get DATABASE_URL --app lonnrot-project
```

Make sure you have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and that you're logged in using:

```
heroku login
```

This command is essential for configuring your app's connection to the production database on Heroku.

## Deployment to Heroku

Make sure you've set up your Heroku remote by running:

```
heroku git:remote --app lonnrot-project
```

Then, to push your latest changes on the main branch to Heroku, simply run:

```
git push heroku main
```

This will deploy your application to Heroku.

## Docker Commands

To build the Docker image for your app, run:

```
docker build -t lonnrot-project .
```

To run the Docker container locally:

```
docker run -d -p 3000:3000 lonnrot-project
```

Additional useful commands:

- **Stop a running container:**

  ```
  docker stop <container_id>
  ```

- **Remove dangling images:**

  ```
  docker image prune -f
  ```

## Available Scripts

You can run the following scripts using Node.js. Make sure you have Node installed on your machine.

- **Import Books**  
  Imports books data into the database.  
  **Command:**  
  ```
  node src/scripts/importBooks.js
  ```

- **Delete Books**  
  Deletes specified books from the database.  
  **Command:**  
  ```
  node src/scripts/deleteBooks.js
  ```

- **Parse Book**  
  Parses individual book files to extract and transform data.  
  **Command:**  
  ```
  node src/scripts/parseBook.js
  ```

- **Scheduler**  
  Manages periodic tasks such as scheduled imports or data cleanup.  
  **Command:**  
  ```
 
  ```

## Prisma Commands

- **Run Prisma Migrations:**  
  Applies any pending database migrations.  
  **Command:**  
  ```
  npx prisma migrate dev
  ```

- **Open Prisma Studio:**  
  Opens the Prisma Studio to inspect and manage your database visually.  
  **Command:**  
  ```
  npx prisma studio
  ```

## Production Deployment

The app is deployed on Heroku with a domain registered via Name.com.  
Visit the live website at: [https://lonnrotproject.live](https://lonnrotproject.live)


# #.env.local

# DATABASE_URL="postgresql://postgres:pass@localhost:5432/lonnrot?schema=public"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-dev-secret"
# JWT_SECRET="your-dev-jwt-secret"


# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false       
# SMTP_USER=ufo.hamed@gmail.com
# SMTP_PASS=kmceomllucuqlmfm  
# SMTP_FROM="Project Lönnrot <no-reply@lonnrotproject.live>"
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
