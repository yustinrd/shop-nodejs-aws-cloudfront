import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Stock} from "../../types";

const client = new DynamoDBClient({region: 'eu-west-1'});

export const createStockInDB = async ({product_id, count}: Stock) => {
    const params = {
        TableName: "stocks",
        Item: {
            product_id: { S: product_id },
            count: { N: count.toString() },
        },
    };
    const command = new PutItemCommand(params);
    return  client.send(command);
}
