<p align="center">
  <a href="https://pawimo-staging.web.app/" target="blank"><img src="https://pawimo-staging.web.app/_next/image?url=%2Fimg%2Flogo-small.png&w=64&q=75" width="75" alt="Pawimo" /></a>
</p>

## Description

Backend for pawimo system.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn docker:dev
$ yarn run start

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Environment Variables

.env is ignored in git and can be used for local development.

For production, use the `Settings -> Environment variables` section in pawimo-api Web App in Azure Portal.

## Logs

Go to `Development Tools -> Advanced Tools` of the app service and click `Go` link. On the Advanced Tools, choose `Log stream` from the above menu.

or download https://pawimo-api.scm.azurewebsites.net/api/logs/docker/zip
