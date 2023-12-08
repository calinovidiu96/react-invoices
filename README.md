# Invoice Dashboard - React Frontend Application

Welcome to the Invoice Dashboard frontend application! This React-based dashboard provides a dynamic and intuitive user interface for managing invoices, customers, and products. The application is built with TypeScript to enhance the development experience.

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)


## About

This frontend application is a dashboard with three main pages: Invoices, Customers, and Products. Each page features pagination for easy navigation through large datasets.

## Key Features

- **Invoice Management:**
  - View a list of invoices with pagination support.
  - Edit or delete existing invoices.
  - Dynamically update invoice details in real-time.

- **Edit Invoice:**
  - Change date, deadline, and customer.
  - Add or remove products from the invoice.

- **Create New Invoice:**
  - Easily create a new invoice, seamlessly added to the list.

- **Real-time Updates:**
  - Utilizes state management for real-time updates without additional API requests.

## Prerequisites

Before running the application, make sure you have Node.js (version 20 recommended) installed.

## Getting Started

1. **Clone the Repository:**
   - Navigate to your project folder.

2. **Install Dependencies:**
   - Run the command to install project dependencies.

3. **Set Up Environment Variables:**
   - If necessary, create a `.env` file with required environment variables.

4. **Run the Application:**
   - Start the application, which will run on http://localhost:3000.

## Project Structure

The project structure is organized as follows:

- **/src**: Contains the source code for the application.
  - **/components**: Reusable React components.
  - **/pages**: Top-level components for each dashboard page.
  - **/services**: API services for interacting with the backend.
  - **/state**: State management using React Context and Hooks.

- **/public**: Static assets and HTML template.

## Usage

Explore the dashboard, navigate through pages, manage invoices, customers, and products effortlessly with the dynamic and intuitive user interface.

