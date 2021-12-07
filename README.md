# pass-man

## Development enviroment

To run local s3 environment:
```
docker run --rm -p 9000:9000 -p 12000:12000 minio/minio server --console-address ":12000" /data
```

[See](https://hub.docker.com/r/minio/minio/) for more details 
