# AiDraw Project
================

## Table of Contents
-----------------

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Components](#components)
4. [Technical Requirements](#technical-requirements)
5. [Getting Started](#getting-started)
6. [Directory Structure](#directory-structure)
7. [API Documentation](#api-documentation)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction
---------------

AiDraw is a web application that allows users to create and manipulate mathematical expressions using a graphical interface. The application consists of two main components: the frontend (aidraw-FE) and the backend (aidraw-BE).

## Project Overview
-----------------

The AiDraw project is designed to provide a user-friendly and intuitive interface for creating and manipulating mathematical expressions. The application uses a combination of React, TypeScript, and Python to provide a seamless user experience.

### aidraw-FE (Frontend)

The frontend of the application is built using React and TypeScript. It is responsible for rendering the user interface and handling user interactions. The frontend communicates with the backend API to retrieve and send data.

### aidraw-BE (Backend)

The backend of the application is built using Python and FastAPI. It is responsible for handling requests and responses from the frontend, as well as storing and retrieving data from the database.

## Components
-------------

*   **aidraw-FE**:
    *   React: Frontend framework
    *   TypeScript: Programming language
    *   Mantine: UI library
    *   Axios: HTTP client library
*   **aidraw-BE**:
    *   Python: Programming language
    *   FastAPI: Backend framework
    *   Pydantic: Data validation library
    *   SQLAlchemy: ORM library

## Technical Requirements
----------------------

*   Node.js (version 14 or higher)
*   npm (version 6 or higher)
*   TypeScript (version 4 or higher)
*   React (version 17 or higher)
*   Mantine (version 5 or higher)
*   Axios (version 0.21 or higher)
*   Python (version 3.8 or higher)
*   FastAPI (version 0.115.3 or higher)
*   Pydantic (version 2.9.2 or higher)
*   SQLAlchemy (version 1.4.32 or higher)

## Getting Started
-----------------

### aidraw-FE

1.  Clone the repository using `git clone https://github.com/aidraw/aidraw-FE.git`
2.  Install dependencies using `npm install`
3.  Start the development server using `npm start`
4.  Open `http://localhost:3000` in your web browser to access the application

### aidraw-BE

1.  Clone the repository using `git clone https://github.com/aidraw/aidraw-BE.git`
2.  Install dependencies using `pip install -r requirements.txt`
3.  Start the development server using `uvicorn main:app --reload`
4.  Open `http://localhost:8000` in your web browser to access the API documentation

## Directory Structure
---------------------

### aidraw-FE

*   `src`: Source code for the application
*   `components`: Reusable React components
*   `constants`: Global constants and variables
*   `screens`: Top-level screens and routes
*   `styles`: Global CSS styles and themes
*   `utils`: Utility functions and helpers

### aidraw-BE

*   `app`: Main application code
*   `models`: Data models and schemas
*   `routes`: API routes and endpoints
*   `services`: Business logic and services
*   `utils`: Utility functions and helpers

## API Documentation
-------------------

The API documentation for the AiDraw backend can be found at [http://localhost:8000/docs](http://localhost:8000/docs).

## Contributing
------------

Contributions are welcome! Please submit a pull request with a clear description of the changes and any relevant documentation.

[Harshit Joshi](https://github.com/Harshitjoc)