# pass-man

## Development enviroment

To run local s3 environment:
```
docker run --rm -u `id --user`:`id --group` -v`pwd`/.dev-data:/data -p 9000:9000 minio/minio server /data
```

[See](https://hub.docker.com/r/minio/minio/) for more details 
