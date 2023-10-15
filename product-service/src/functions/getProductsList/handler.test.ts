import type {APIGatewayProxyResult} from "aws-lambda"

import {getProductsList} from './handler';

jest.mock('@libs/lambda', () => ({
    middyfy: jest.fn((inputFunction) => inputFunction),
}));

describe('getProductsList', () => {
    it('should return a valid response', async () => {
        // @ts-ignore
        const response = await getProductsList() as APIGatewayProxyResult;

        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('products');
    });
});
