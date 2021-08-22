# Project: NASA Backend API

**Current Version: 0.0.4**

TODO:

- Link to live site
- README.md project image
- Implement backend using node/express

## Description

The goal of this project is to create a RESTFul API that will serve planet data
to the client.

### Stack

- React
- [ARWES Sci-Fi UI Framework](https://github.com/arwes/arwes)
- Node.js & Express.js

## Getting Started

To run this project in development mode, please follow the instructions below.

```
npm run install
npm run watch
```

To run this project in a production environment, please use the following
command.

```
npm run deploy
```

### Version History

**Version 0.0.4**

**Version 0.0.3**

Implemented several npm scripts to automate the application. These scripts can
be found in the root package.json file.

**Version 0.0.2**

Added planet data to API. The data has been retrieved from the NASA
[kepler exoplanet dataset](https://exoplanetarchive.ipac.caltech.edu/docs/data.html).

The data is stored in a csv file and so a read/write stream was used to parse
the file.

**Version 0.0.1**

Added app boilerplate.
