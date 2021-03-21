import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk/global';

export default class AWSBackend {

    private client:S3;

    constructor(endpoint?:string) {
        this.client = new S3({
            endpoint: new AWS.Endpoint(endpoint),
            credentials: {
                accessKeyId: "minioadmin",
                secretAccessKey: "minioadmin"
            },
            s3ForcePathStyle: true
        });
    }

    fetchResource(bucketName: string, sourcePath: string, encode?: string): Promise<string> {
        sourcePath = sourcePath.startsWith('/')? sourcePath.substring(1) : sourcePath;

        return new Promise((resolve, reject) => {
            let request:S3.GetObjectRequest = {
                Bucket: bucketName,
                Key: sourcePath
            }

            this.client.getObject(request, function(err, output) {
                if(err && err.code == "NoSuchKey") {
                    return resolve("")
                } else if(err) {
                    return reject(err);
                } else {
                    return resolve(output.Body.toString());
                }
            });
        })
    }

    storeResource(bucketName:string, targetPath:string, content:string) :Promise<string> {
        return new Promise((resolve, reject) => {
            let request:S3.PutObjectRequest = {
                Body: content,
                Bucket: bucketName,
                Key: targetPath,

            }

            this.client.putObject(request, function(err, output) {
                if(err) {
                    return reject(err);
                }

                return resolve(content)
            })
        });
    }
}