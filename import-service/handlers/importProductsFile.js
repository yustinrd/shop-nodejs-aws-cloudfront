import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {UPLOAD_FOLDER, BUCKET_NAME} from "./constants";

const s3Client = new S3Client({region: "us-west-1"});

export default async (event) => {
    const query = event.queryStringParameters;
    const fileName = query.name;
    const fileContents = event.body;

    const config = {
        Bucket: BUCKET_NAME,
        Key: `${UPLOAD_FOLDER}${fileName}`,
        Body: fileContents,
    };
    const putCommand = new PutObjectCommand(config);

    try {
        await s3Client.send(putCommand);
        const url = await getSignedUrl(s3Client, putCommand, {expiresIn: 3600});
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: url
        }
    } catch ({message}) {
        console.error("Error uploading file to S3:", error);
        return {
            statusCode: 500,
            message,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        }
    }
}
