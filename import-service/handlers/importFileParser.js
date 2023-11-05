import {
    GetObjectCommand,
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import csv from "csv-parser";
import {UPLOAD_FOLDER, BUCKET_NAME, PARSED_FOLDER} from "./constants";

const s3Client = new S3Client();

const saveData = async (key, bucketName, data) => {
    console.log('File content', data)
    const jsonContent = JSON.stringify(data);
    const newKey = key.replace(UPLOAD_FOLDER,PARSED_FOLDER) + "_parsed.json";
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: newKey,
        Body: jsonContent,
    });

    try {
        await s3Client.send(putCommand);
    } catch (error) {
        console.log("Error saving", error);
    }
}

const deleteFile = async (key, bucketName) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    console.log(`Deleting the file ${key}`);

    try {
        await s3Client.send(deleteCommand);
    } catch (error) {
        console.log("Error deleting the file:", error);
    }
}

const loadData = (key, bucketName) => {
    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    return new Promise(async (res, rej) => {
        console.log("Receiving reading stream from S3");
        const {Body} = await s3Client.send(getCommand);
        const array = [];
        const parser = csv();
        Body.pipe(parser)
            .on("data", (data) => {
                array.push(data);
            })
            .on("end", async () => {
                await saveData(key, bucketName, array);
                await deleteFile(key, bucketName);
                res();
            })
            .on('error', (error) => {
                rej('Parsing error:', error)
            });
    })
}

export default async (event) => {
    const {
        bucket: {name: bucketName},
        object: {key},
    } = event.Records[0].s3;

    try {
        await loadData(key, bucketName);
    } catch (e) {
        console.log("An Error occurs: ", e);
    }
};
