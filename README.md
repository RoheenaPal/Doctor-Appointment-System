# Doctors' Appointment Website

A portal for users to book appointments of the specific doctor at their available time (displayed in the portal) acoording to their needs.

## Steps to use it

1. Clone or download the repository to your local machine.

2. Install the required npm version and update the local node_modules repository with the versions present in package.json:

   ```
   npm install
   ```
3. Connect MongoDB Atlas to get the database connection.

4. Run the server and client to view the website:

   ```
   npm run dev
   ```

5. Once the server started, you might see a message "Server running on port 8000".

6. Open your browser and type localhost:3000, the login page will be displayed.

7. Make a new account or log in to your existing account!

## Features

- Different home pages for admin, doctors, and users.
- A user with an account can apply to be a doctor to get the doctor's account facilities.
- The admin's task is to either approve or reject the doctors' profiles based on their authenticity.
- The appointment by the users will also have to be approved by the admin so that there is no overlap of timings.
