### Table of Contents  

[Architecture](#architecture)

[Setup Instructions](#setup)

[Design Goals](#design)

[Security Goals](#security)

[Design/Scalability](#scalable)

[Algorithm](#algo)

-----
<a name="architecture"/>

## Architecture
1) Front End: ReactJS
2) Back End: KoaJS API Server
3) Database: MySQL Database

-----
<a name="setup"/>

## Setup Instructions
The following installation process assumes that NodeJS has already been installed in the local environment.

### Timezone
One of the features of the URL Shorterner is the ability to set an expiry date for generated short links.
Once the links expire, they will no longer redirect user to the original link.
For this, a datetime comparison is done. The timezone setting for database and Node.JS is as follows:
1) MySQL table: UTC/GMT+8
2) Node.JS environment: UTC/GMT+0

### Backend & Frontend
1) Download and unzip the project at a local directory.
2) Use ```npm install``` at the root of the project directory to install the required packages for back end.
3) cd into the ```/frontend``` folder and use ```npm install``` to install the required packages for front end.
4) For running the back end API server, use ```node index``` at the root of the project directory.
5) For running the front end interface, cd into ```/frontend``` folder and run ```npm start```.
6) For configuration of server port, change .env config for ```SERVER_PORT```, ```DEV_PREFIX``` accordingly.
7) Set up .env config for both front end and back end accordingly, refer to [.env Config](#env) for more details.

### Database
The following installation process assumes that MySQL has already been installed on the local environment.

1) Create database and import ```links.sql``` which contains the table needed for the application.
2) Change .env config for ```DB_HOST```, ```DB_USER```, ```DB_PASSWORD```, ```DB_NAME``` accordingly.

### Tests
While MySQL is up and running with the required tables, at the root of the project directory, run ```npm test```.
1) The test will check if the database table has been set up correctly to not allow duplicate short links to be inserted.

<a name="env"/>

### .env Config (Backend)
The .env configuration file contains the following:
1) ```SERVER_PORT``` port number to run API backend server.
2) ```DEV_PREFIX``` prefix for shortened URL on testing environment.
3) ```PROD_PREFIX``` prefix for shortened URL on production environment, default is empty.
4) ```RUNTIME_ENV``` either set to "TEST" or "PROD" for test/production environment.
5) ```DB_HOST``` host for the MySQL database server, default is "localhost".
6) ```DB_USER``` username for MySQL database, default is "root".
7) ```DB_PASSWORD``` password for MySQL database, default is "".
8) ```DB_NAME``` database name, default is "urlshortener".
9) ```BASE_64``` the set of characters to be used when encoding shortened URL.
10) ```SHORT_LINK_LENGTH``` length of the shortened link, default is "7".

### .env Config (Frontend)
The .env configuration file contains the following:
1) ```REACT_APP_RUNTIME_ENV``` either set to "TEST" or "PROD" for test/production environment.
2) ```REACT_APP_API_ENDPOINT_DEV``` endpoint URL of the backend in "TEST" (development) environment, default is "http://localhost:3001".
3) ```REACT_APP_API_ENDPOINT_PROD``` endpoint URL of the backend in "PROD" (production) environment, default is empty.

-----
<a name="design"/>

## Design Goals
1) Users can generate shortened URL using their original URL
2) The shortened URL will redirect users to the original URL

-----
<a name="security"/>

## Security Goals
1) URL should not be predictable or can be reverse engineered
2) URL should not reveal details about its user or creator
3) Creator should be able to specify an expiration time for the URL
4) If URL expires, deactivate it, do not DELETE
5) Do not allow other URLs to replace expired URLs for security purpose (prevented by point 4 and UNIQUE requirement in Database schema design)
6) Sanitize original URL to prevent XSS injection

-----
<a name="scalable"/>

## Design/Scalability
1) Suppose we use characters a-z, A-Z, 0-9 for our shortened URL key, and make it n characters long, the possible number of URLs would be (permutation with repetition):
62^n
2) Suppose we choose n = 7, then the number of possible URLs we can have is 62^7 = 3521614606208
3) If needed, it can be expanded to n = 8, n = 9, etc

-----
<a name="algo"/>

## Algorithm
1) Generate 7 characters for the shortened URL from string "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
2) Create a random unique number by combining Date.now() and Math.random()
3) Randomly get a character from a-z, A-Z, 0-9 by performing modulo operation on the unique number to generate an index, then grab the character at that index from the string 7 times.
4) After each round, divide the unique number by 62.
