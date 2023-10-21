import type {APIGatewayProxyResult} from "aws-lambda"

import {getProductById} from './handler';
import {products} from '../mock'

jest.mock('@libs/lambda', () => ({
    middyfy: jest.fn((inputFunction) => inputFunction),
}));

describe('getProductById', () => {
    it('should return a valid response', async () => {
        const event = {
            pathParameters: {
                productId: products[0].id
            }
        }
        // @ts-ignore
        const response = await getProductById(event) as APIGatewayProxyResult;

        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('product');
    });

    it('should return 404', async () => {
        const event = {
            pathParameters: {
                productId: 123
            }
        }
        // @ts-ignore
        const response = await getProductById(event) as APIGatewayProxyResult;

        expect(response.statusCode).toBe(404);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).not.toHaveProperty('product');
    });
});
