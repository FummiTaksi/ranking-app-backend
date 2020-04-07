Goals of this app: Offer tabletennis rankings in user readable form, and offer long time tracking of players rankings

[Link to app](https://tabletennis-ranking-app.herokuapp.com/)

Travis build: [![Build Status](https://travis-ci.org/FummiTaksi/ranking-app-backend.svg?branch=master)](https://travis-ci.org/FummiTaksi/ranking-app-backend)

Coverage of unit tests: [![Coverage Status](https://coveralls.io/repos/github/FummiTaksi/ranking-app-backend/badge.svg?branch=master)](https://coveralls.io/github/FummiTaksi/ranking-app-backend?branch=master)

[Working hour records:](https://docs.google.com/spreadsheets/d/1V7HlcqmnLazPMtnx6VOmoptp2m-XOXWnCsU-GU69V9w/edit?usp=sharing)

[Link to frontend](https://github.com/FummiTaksi/ranking-app-frontend)


# HOW TO RUN

## PREREQUISITIES

Homebrew,npm

### Install mongodb-community

````
brew tap mongodb/brew
brew install mongodb-community
````




## Start development

With the correct .env file do the following from the root of the repository

```
npm install
npm run watch
```

The application should open in localhost:3001

## Running tests

Run tests:

```
brew services start mongodb-community
npm run test
```

Teardown:

```
brew services stop mongodb-community
```





