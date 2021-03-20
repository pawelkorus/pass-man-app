import S3 from 'aws-sdk/clients/s3';
import { resolve } from 'dns';

export default class AWSBackend {

    private client:S3;

    constructor() {
        this.client = new S3();
    }

    fetchResource(bucketName: string, sourcePath: string, encode?: string): Promise<string> {
        let client = new S3()
        sourcePath = sourcePath.startsWith('/')? sourcePath.substring(1) : sourcePath;

        return new Promise((resolve, reject) => {
            let request:S3.GetObjectRequest = {
                Bucket: bucketName,
                Key: sourcePath
            }

            client.getObject(request, function(err, output) {
                if(err) {
                    return reject(err);
                }

                return resolve(output.Body.toString());
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