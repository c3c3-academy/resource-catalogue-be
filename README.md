# Willy Wonka's Resource Factory Backend

This is the backend respository for [Willy Wonka's Resource Factory](https://github.com/c3c3-academy/resource-catalogue-fe).

- [Documentation](https://www.notion.so/weareacademy/Team-C3C3-Project-3-f6c294677db04465995852662384ba71)
- [Deployed API](https://resource-catalogue-be.herokuapp.com/)

## Install

`yarn`

## DB Setup

Copy .env.example to .env and set `DATABASE_URL` and `PORT` to your liking.

Example for a local database: `DATABASE_URL=postgres://neill@localhost/pastebin`

You will need to create your own databases for this project - one locally and one on Heroku.

## Running locally

`yarn start:dev`

This will set the env var LOCAL to true, which will cause the db connection configuration to NOT use SSL (appropriate for your local db)

## running on heroku

When the project is deployed to heroku, the command in your `Procfile` file will be run.

## Create and Populate Database
SQL Query to Create Table
The Create-table.sql file provides the queries used to create the tables for this project.

## Running API
### Running locally

```yarn start:dev```

This will set the env var LOCAL to true, which will cause the db connection configuration to NOT use SSL (appropriate for your local db)

### Running on heroku
```yarn start:dev:heroku```

When the project is deployed to heroku, the command in your Procfile file will be run.
