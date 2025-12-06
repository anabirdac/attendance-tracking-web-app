# Attendance Backend (Node.js + Express + Sequelize + MariaDB)

## ❀ Pre-requisites
- Node.js (16+ recommended)
- MariaDB server (you can use HeidiSQL to manage it)
- Git

## ❀ Setup

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd backend
   
2. Copy .env.example to .env and edit values:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=attendance_db
PORT=4000
QR_API=https://api.qrserver.com/v1/create-qr-code/?data=


3. Create the database (via HeidiSQL or CLI):

CREATE DATABASE attendance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;


4. Install dependencies:

npm install


5. Start the server in development:

npm run dev

or production:

npm start


The server will automatically sync models to the database and start a cron job to update event states every minute.