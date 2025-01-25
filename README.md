# Football Online Manager 

Welcome to my Football Online Manager. This web application allows users to manage their football teams, buy players, and more. The app is built using React for the frontend and Node.js for the backend.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Time Report](#time-report)
- [License](#license)

## Description

This task is a football fantasy manager application where users can create a football team, manage transfers, and buy players. The key features of the app include user registration, team creation, a transfer market for buying and selling players, and the ability to manage team budgets.

### Product Requirements

- **User Management**: 
  - Users can register/login with their email and password using a single flow for both registration and login.

- **Team Creation**:
  - Upon registration, users receive a team with a budget of $5,000,000 and a team consisting of:
    - 3 Goalkeepers
    - 6 Defenders
    - 6 Midfielders
    - 5 Attackers

- **Transfer Market**:
  - Users can filter transfers by team name, player name, and price.
  - Users can add/remove players to/from the transfer list and set specific asking prices.
  - Users can buy players from other teams at 95% of their asking price.
  - Teams must always have between 15 and 25 players.

## Features

- **User Registration/Login**: 
  - Single form to handle both registration and login.
  
- **Team Creation**:
  - Automatically generate a team of 20 players upon user registration.
  
- **Transfer Market**:
  - Filter transfers by team, player name, and price.
  - Buy players from the market and manage your team's roster.

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React.js using NextJS and styling/component libraries such as Material UI and Tailwind CSS
- **Database**: Using MySQL for this project but locally. You will need to start the server locally, set up your credentials in a new `.env` file inside the backend folder, and start testing the endpoints.
- **Authentication**: JWT
- **Version Control**: Git (GitHub repository)

## Setup Instructions

- **Backend**: Please go to the `README.md` file inside the `football-manager-backend` and follow the steps.
- **Frontend**: Please go to the `README.md` file inside the `football-manager-frontend` and follow the steps.

## Time Report  

### Time Spent on Each Section:

1. **Project Setup & Initial Configuration** - 2 hours
   - Set up the project structure and install dependencies.
   - Configure backend (Node.js) and frontend (React.js).
  
2. **User Management (Registration/Login)** - 1 hours
   - Implemented authentication flow using JWT or sessions.
   - Set up login and registration routes and front-end forms.

3. **Team Creation** - 3 hours
   - Created the logic for generating teams with 20 players.
   - Implemented initial budget handling and team display.

4. **Transfer Market** - 3 hours
   - Built features to list players for transfer, search, and filter players.
   - Implemented the buy player functionality at 95% of their asking price.

5. **Styling & UI Design** - 0 hours
   - No started yet

6. **Testing and Bug Fixing** - Throughout the project
    - Spent time debugging and testing each endpoint (backend) and frontend functionality.
    - Fixed issues with user experience and backend logic as they appear.
