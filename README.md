# Financial Data Manager Project 
Team Members: Carissa Trieu and Ashwath Balaji

## Project Overview
This repository contains the final database project for CMSC 408. This project designs a financial data management system to help investors and other users make informed decisions in the stock market. 

## Key deliverables:  
* [GitHub Repository](https://github.com/cmsc-vcu/cmsc408-fa2024-proj-team-business) 
* [Pitch Video](https://vcu.mediaspace.kaltura.com/media/Carissa%20Trieus%20Personal%20Meeting%20Room/1_l7xt74sb)
* [Design Video](https://vcu.mediaspace.kaltura.com/media/Carissa+Trieu%27s+Personal+Meeting+Room/1_p7fqttji)
* [Project Pitch Video](https://vcu.mediaspace.kaltura.com/media/t/1_2bfyjdz2)  

## Project Description
The database stores financial data such as income statements, balance sheets, cash flows, and company earnings. This is displayed in a web interface that is able to perform CRUD operations. To see the completed project in detail, view [Deliverable 12 on GitHub Pages.](https://trcrsa.github.io/del12reports/deliver-12.html)

## Repo Overview
- *reports* folder:
    - *deliver-12.html*: final project report.
    - *deliver-8.html*: preliminary design report.
- Database schema: *my-ddl.sql* is a file defining the database schema and relationships.
- *php* folder: contains the backend scripts to perform CRUD for the database.
    - *db.php* manages the database connection to phpMyAdmin
- *reactapp* folder: contains the React.js front end development. 
    - *App.js* is the main script of the application and is the UI's entry point.
    - *index.css* is the main CSS/style scrip for the front end. 

## Tools Used 
- React.js
- PHP
- MySQL via phpMyAdmin
- Kaltura
- SQL Tools extension
- VS Code
- Quarto
- Jupyter Notebook
- Poetry

## How to Run
The repository should be cloned. After successfully doing so, host the /PHP on a server, and start running it. The DDL file should be imported using SQLTools extension on VS Code or another tool. Navigate to the React directory and run "npm install" and "npm start". The web interface should successfully be accessible. 