# Personal Financial Tracking App
Welcome to FinFlow, your all-in-one personal tracking app designed to help you take control of your daily life, habits, and goals. Whether you're looking to build healthier routines, monitor your productivity, or simply gain better insight into your day-to-day patterns, FinFlow offers an intuitive and customizable platform to support your journey.

With powerful tracking tools, smart analytics, and personalized insights, FinFlow empowers you to understand yourself better—so you can make meaningful progress, one step at a time.

## Run Command
python run.py
(be sure that you have set up your virtual environment first!)

## Features
- SQLAlchemy for back-end object-relational mapping
- Socket.IO for websockets and real-time communication between clients
- Bootstrap for front-end UI components
- Front-end data model for object-relational mapping and API integration

## Steps
- Create your virtual environment using requirements.txt
- Set up your database connection and other variables in config.py
- To use a websocket, uncomment two areas in app.py (see notes in file)
- Add tables to your database (can use chatgpt to generate ddl)
- Add python objects to model.py representing the tables (see notes in file)
- Edit routes.py to create your back-end API (see notes in file)
- Edit websockets.py if you plan to use websockets (see notes in file)
- Edit the index.html and include UI for logging on (see notes in file)
- Edit the index.js file to handle events from index.html (see notes in file)
- Rename example_app_page.html and create the app's html UI (see notes in file)
- Update datamodel.js to handle API calls and manage data (see notes in file)


