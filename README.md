# pass-man

## Setup node

```
export PATH=~/Programs/node-v12.16.3-linux-x64/bin/:$PATH
```
or
```
source setup_node
```

## Development enviroment

To run local s3 environment:
```
docker run -p 9000:9000 minio/minio server /data
```

[See](https://hub.docker.com/r/minio/minio/) for more details 