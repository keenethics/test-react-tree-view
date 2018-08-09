# Tree View Test

## Goal
Develop a tool which visually presents data in a tree-view format. The goal of the exercise is to allow the client to validate our software development skill.

## Assumptions
- We think, that all functionality should be available only for authorised users. However, we don't complete a visible module to login/signup, because it would take aditional time. We can add this later.
- Based on the previous point, we use JWT for users, because we think that this is a fastest way to indentify a user

## Tech stack (front end & back end)
- front end:
React
- back end:
Node.js, Restify, MongoDB, Mongoose, Docker

## Prerequisites

- Node >= v8
- Docker >= v18
- npm >= 5.6.0
- yarn > 1.7
- OS: Latest versions of Max OSX or Linux

## Installation
> Please follow 
> ### Install all required modules
> Install Homebrew:
> ```
> npm install
> ```
or
> ```
> yarn
> ```
> ### Install and start the mongodb database (docker container)
> ```
> npm run start:db
> ```
> If the installation fails, please add the .env.remote file to the root of the project to connect to the remote database 

## Run
Please follow the below steps in a sequential order:
Start the mongodb server (if you haven't already)
```
$ npm run start:db
```
Start the api node server:
```
$ npm run start:server
```
Start the web server serving the react web-page
```
$ npm run start:client
```

## Testing
Run fron-end unit tests:
```
$ npm run test:unit
```
Run API integration tests:
```
$ npm run test:integration
```
