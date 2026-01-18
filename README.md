# Solita Dev Academy 2026 - Electricity Data Display

![Version](https://img.shields.io/badge/version-1.0.0-green.svg) ![Docker](https://img.shields.io/badge/docker-supported-blue.svg)

A full-stack application built for the Solita Dev Academy 2026 pre-assignment. This solution visualizes electricity price and consumption data and view hourly data in graphs.

The assigment can be find from here: https://github.com/solita/dev-academy-spring-2026-exercise


## Key Features
* **Server-Side Pagination:** Efficiently handles large datasets by loading data in chunks.
* **Daily Data View:** Detailed individual views for specific dates.
* **Visualization:** Graphs to visualize hourly electricity consumption and pricing.

## Technologies Used
* **Frontend:** React, Chakra UI, TanStack Table, TanStack Query
* **Backend:** Node.js, Express, Prisma ORM
* **Infrastructure:** Docker, Docker Compose

## Installation & Setup
This project uses Docker to orchestrate the client, server, and database.

### 1. Prerequisites
* [Docker Desktop](https://docs.docker.com/desktop/) (Ensure it is running)

### 2.Clone the repositories
**Important:** This solution relies on the original assignment data.
First, clone the original assignment repository (for the data) and this solution repository into the same folder.

#### 1. Clone the assignment data (Check the URL in your instructions)
```bash
git clone https://github.com/solita/dev-academy-spring-2026-exercise.git
```
#### 2. Clone this solution
```bash
git clone https://github.com/ojahnukainen/SolitaDevAcademy2026.git
```
After cloning you should have following structure
```text
/Your-Workspace
├── dev-academy-spring-2026-exercise  
└── SolitaDevAcademy2026              
```
#### 4. Start the Application
Navigate to the solution directory and start the Docker containers.
```bash
cd SolitaDevAcademy2026
docker compose up --build --renew-anon-volumes -d
```
#### 5. Access the App
Once the build is complete (this may take a few minutes), open your browser:
```bash
http://localhost:5005
```

