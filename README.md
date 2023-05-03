# Codeforces Analyzer
This is a web application built using EJS, bootstrap and Node.js that analyzes Codeforces user statistics and provides various insights and visualizations.

Please note that the Codeforces Analyzer website is still under construction and may be missing some features. We plan to add more features in the future, so stay tuned for updates!

## Installation
To install and run the application, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running npm install.
3. Start the application by running nodemon app.js in terminal.

The application should now be running on http://localhost:3000.

## Dependencies
This project uses the following dependencies:

1. body-parser: A middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property.
2. chart.js: A JavaScript library that allows you to draw different kinds of charts on your web pages.
3. ejs: A templating engine that lets you generate HTML markup with plain JavaScript.
4. express: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Usage
Once the application is running, you can access it by visiting http://localhost:3000 in your web browser. You will be prompted to enter a Codeforces username to analyze. Once you enter a valid username, the application will retrieve the user's statistics from the Codeforces API and display various insights and visualizations, including:

1. A chart showing the user's solved problems by rating
2. Table show States of all submissons

soon will be more updates and more statistcs.

## Known Issues
The application may be slow to load or may fail to retrieve user statistics if the Codeforces API is down or if there are connectivity issues.

## Contributing
If you'd like to contribute to the project, please follow these guidelines:

1. Fork the repository and create a new branch for your changes.
2. ake your changes and commit them with clear commit messages.
3. Submit a pull request and include a clear description of your changes.
