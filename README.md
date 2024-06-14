# ElMazad - Online Auction Platform Backend

ElMazad is an online auction platform where users can list items, place bids, and participate in auctions. This repository contains the backend of the application built using Node.js, Prisma, and PostgreSQL.

## Features

### Comprehensive User Management

- **User Registration and Login**: Secure password hashing for user credentials.
- **User Profiles**: Profiles include user information and profile picture.
- **User Dashboards**: Manage listings, bids, won auctions, and settings.

### Item Listing

- **Create Listings**: Detailed item listings with descriptions, categories, and high-quality images.
- **Pricing Options**: Set starting prices, reserve prices (minimum acceptable bid), and buy now options.

### Auction Creation and Management

- **Create Auctions**: Auctions can be set for specific durations ranging from 2 to 10 days.
- **Bidding System**: Real-time bid updates and highest bid tracking.
- **Notifications**: Real-time and email notifications for outbidding and winning auctions.

### Secure Payment Processing

- **Payment Gateway Integration**: Secure transactions post-auction (details to be configured).

### Admin Panel

- **Administrative Tools**: Manage users, auctions, and website settings.
- **User Account Management**: Oversee user accounts and auction activities.
- **Website Configuration**: Adjust website parameters and settings.

## Technologies

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

- Node.js
- npm (or yarn)
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shorokosamaa/elmazad-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd elmazad-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. Set up the PostgreSQL database:

   - Create a new PostgreSQL database.
   - Create a `.env` file in the root of the project and add your database URL:

   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database-name>"
   ```

5. Generate Prisma client and migrate the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name <migration-name>
   ```

### Seeding the Database

- To seed the database with initial data, run:

  ```bash
  npm run seed
  ```

  or

  ```bash
  yarn seed
  ```

### Running The Application

- To start the development server, run:

  ```bash
  npm start
  ```

  or

  ```bash
  yarn start
  ```

  This will start the backend server on http://localhost:5000.

### Running Database Migrations

- If you make changes to the Prisma schema, run the following command to apply the migrations:

  ```bash
  npx prisma migrate dev
  ```

### Building for Production

- To build the app for production, run:

  ```bash
  npm run build
  ```

  or

  ```bash
  yarn build
  ```

### Deployment

For deployment, ensure your production environment variables are set correctly. Follow your hosting service's instructions to deploy a Node.js application.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
