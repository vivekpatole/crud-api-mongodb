# crud-api-mongodb
API to perform CRUD operation using Node JS &amp; MongoDB


## Prerequisites
1. 'Node'
2. 'npm'
3. 'MongoDB'


## Set Environement Veriables
Edit .env file to set environment variables
1. 'NODE_ENV' - Runtime Environment 
2. 'PORT' - Port on which the express server is running
3. 'DB_HOST' - MongoDB Host Name and Port e.g. 'localhost:2718'
4. 'DB_NAME' - Database Name
5. 'AUTH_TOKEN' - API Authorization Token (Hard Coded)
6. 'WRONG_AUTH_TOKEN' - Incorrect API Authorization Token for Testing (Hard Coded)


## Steps to Run Tests
1. Install the project dependencies from the project directory using command 
  ```
  npm install
  ```
2. Execute Test Cases using below command from the project directory
  ```
  npm test
  ```
  OR
  ```
  mocha
  ```
  
  
## How to Start Express Server
  ```
  node server.js
  ```
    
