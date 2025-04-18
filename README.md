# Crowdfunded

This is a web application built with Next.js, React, Tailwind CSS, and utilizes the Deno runtime, likely within a Dockerized environment managed by Docker Compose.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Runtime:** [Deno](https://deno.land/) (used alongside Node.js for Next.js tooling)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (inferred from dependencies and typical Docker setups)
*   **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Prerequisites

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)
*   [Make](https://www.gnu.org/software/make/) (standard on Linux/macOS, available for Windows)
*   [Git](https://git-scm.com/)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd crowdfunded
    ```

2.  **Set up environment variables:**
    *   Create a `.env.local` file in the project root.
    *   Copy the required environment variables structure. You might need to refer to `.env.local` (if it exists with placeholders) or potentially `GOOGLE_AUTH_SETUP.md` for required variables like database credentials, authentication secrets, etc.
    *   **Example `.env.local` structure (Update with actual required variables):**
        ```env
        # PostgreSQL Connection (Example)
        POSTGRES_USER=your_db_user
        POSTGRES_PASSWORD=your_db_password
        POSTGRES_DB=crowdfunded_dev
        DATABASE_URL="postgresql://your_db_user:your_db_password@db:5432/crowdfunded_dev"

        # Authentication (Example - Refer to GOOGLE_AUTH_SETUP.md)
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        AUTH_SECRET=generate_a_strong_secret_key # Used by NextAuth.js or similar

        # Add other necessary variables...
        ```
    *   Fill in the values specific to your development environment. See `GOOGLE_AUTH_SETUP.md` for details on setting up Google authentication.

3.  **Build and Run with Docker Compose (Recommended):**
    This project uses a `Makefile` to simplify Docker Compose operations.

    *   **Build the Docker images:**
        ```bash
        make build
        ```
    *   **Start the application and database containers in the background:**
        ```bash
        make upd
        ```
        The application should be accessible at `http://localhost:3000` (or the port specified in your Docker/Next.js config).

## Makefile Commands

The `Makefile` provides convenient shortcuts for managing the Docker environment:

*   `make build`: Builds or rebuilds the Docker images.
*   `make up`: Starts the containers in the foreground (shows logs).
*   `make upd`: Starts the containers in the background (detached mode).
*   `make down`: Stops and removes the containers, networks, and volumes.
*   `make restart`: Stops and restarts the containers in the background.
*   `make reup`: Stops, removes, rebuilds, and restarts containers in the foreground.
*   `make reupd`: Stops, removes, rebuilds, and restarts containers in the background.
*   `make clean`: Stops and removes containers, networks, and volumes, then prunes the Docker system to free up space.

## Deno Usage

Deno is part of the stack. Configuration is managed via `deno.json`, and dependencies are locked in `deno.lock`.

