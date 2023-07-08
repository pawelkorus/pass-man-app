# pass-man

## Development enviroment

This project uses [Localstack](https://localstack.cloud/) to mock some of the AWS services. In order to preconfigure AWS services run by Localstack you might put additional script in `localstack` directory. Currently, sample `test` bucket is created this way. Another important part is that additional CORS origings need to be specified in order to access aws services exposed by Localstack when running application using webpack. It is done by setting `EXTRA_CORS_ALLOWED_ORIGINS` (see [Security](https://docs.localstack.cloud/localstack/configuration/)) environment variable in `docker-compose` file.

To run project dependencies localy just execute:
```
docker compose up
```
