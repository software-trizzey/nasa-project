# Version History

## CURRENT VERSION: 0.0.8

**Version 0.0.8**

Finished implementing the CI portion of the CI/CD Pipline with GitHub Actions.

It will currently build the project and perform unit and integration tests on
the commited code.

The next step will be to deploy the projec to the cloud using AWS & Docker.

**Version 0.0.7**

Began implementing CI/CD pipeline using GitHub Actions.

**Version 0.0.6**

Migrated planet data to MongoDB Atlas for persitent storage.

Began implementing SpaceX API to populate the launch history page.

**Version 0.0.5**

Added several API tests using the JEST testing library.

**Version 0.0.4**

Added the ability to launch a new mission as well as abort an existing one.

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
