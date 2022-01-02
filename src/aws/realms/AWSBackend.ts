import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { hostHeaderMiddlewareOptions } from "@aws-sdk/middleware-host-header"
import { HttpRequest } from "@aws-sdk/protocol-http";
import { Credentials, Provider } from "@aws-sdk/types"
import { S3RealmsProperties } from './realms.api'

export default class AWSBackend {

    private client:S3Client;

    constructor(awsSource:S3RealmsProperties, credentials?:Credentials) {
        this.client = new S3Client({
            endpoint: awsSource.endpoint,
            credentials: credentials,
            forcePathStyle: awsSource.endpoint? true : false,
            region: awsSource.region
        });

        this.client.middlewareStack.addRelativeTo((next:any, ctx:any) => (args:any) => {
            if (!HttpRequest.isInstance(args.request)) return next(args);
            const { request } = args
            const { headers, port } = request
            if(headers['host']) {
               headers['host'] = headers['host'] + (port?  ':' + port : '')
            }
            return next(args);
        }, {
            relation: 'after',
            toMiddleware: hostHeaderMiddlewareOptions.name
        })   
    }

    async fetchResource(bucketName: string, sourcePath: string): Promise<string> {
        sourcePath = sourcePath.startsWith('/')? sourcePath.substring(1) : sourcePath;

        const request:GetObjectCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: sourcePath,
            ResponseCacheControl: "no-store"
        })
    
        try {
            const { Body } = await this.client.send(request);
            return toString(Body as ReadableStream | Blob)
        } catch(error) {
            const { httpStatusCode } = error.$metadata
            if(404 == httpStatusCode) {
                return ''
            } else {
                throw error
            }
        }
    }

    async storeResource(bucketName:string, targetPath:string, content:string) :Promise<string> {
        const request:PutObjectCommand = new PutObjectCommand({
            Body: content,
            Bucket: bucketName,
            Key: targetPath,
            CacheControl: "no-store"
        })

        await this.client.send(request)
        return Promise.resolve(content)
    }
}
  
async function toString(body: ReadableStream | Blob):Promise<string> {
    const response = new Response(body)
    return response.text()
}
