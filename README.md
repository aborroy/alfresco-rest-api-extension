# Alfresco Repository REST API extension

This project includes an extension for Alfresco Repository REST API that provides a new `all` endpoint for Content Services retrieving every Node Id from `STORE_REF_WORKSPACE_SPACESSTORE` using a pagination mechanism.

* [alfresco-remote-api-ext](alfresco-remote-api-ext) is an ACS Repository Java 17 addon that extends [alfresco-community-repo](https://github.com/alfresco/alfresco-community-repo) adding a new REST endpoint `all` that accepts `skipCount` and `maxItems` to get a paginated list of Node Is
  * http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/all
* [docker](docker) is a Docker Compose template to deploy ACS 7.4 with the `alfresco-remote-api-ext` addon applied
* [alfresco-js-api-ext](alfresco-js-api-ext) is a NodeJS 18 extension for (alfresco-js-api)[https://github.com/Alfresco/alfresco-js-api] that adds the new `all` REST API endpoint
  * The [test](alfresco-js-api-ext/test) folder includes NodeJS sample code to use the new REST API endpoint together with other useful invocations (like get nodes by query, get node metadata and get renditions)


## Running the project

1. Building [alfresco-remote-api-ext](alfresco-remote-api-ext) with Maven (Java 17 is required)

```bash
cd alfresco-remote-api-ext

mvn clean package

cp cp target/alfresco-remote-api-ext-0.8.0.jar ../docker/alfresco/modules/jars
```

2. Starting ACS with Docker Compose (Docker is required)

```bash
cd docker

docker compose up --build --force-recreate
...
docker-alfresco-1 | INFO [main] org.apache.catalina.startup.Catalina.start Server startup in [24237] milliseconds
```

Verify that ACS is up and running accessing to http://locahost:8080/alfresco (default credentials are `admin/admin`)

3. Running NodeJS tests (NodeJS 18 is required)

```bash
cd alfresco-js-api-ext

nvm use 18

npm test
...
  6 passing (756ms)
```