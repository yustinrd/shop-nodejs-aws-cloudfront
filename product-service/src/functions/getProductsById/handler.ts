import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {products} from "@functions/mock";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let product;
  let response;

  try {
    const { productId } = event.pathParameters;
    product = products.find(item => item.id === productId)
    response = formatJSONResponse({product});
  } catch (e) {
    return {
      ...formatJSONResponse(
          {
            message: "Error"
          }),
      statusCode: 500
    }
  }

  if(!product) {
    return {
      ...formatJSONResponse(
        {
          message: "Product not found"
        }),
      statusCode: 404
    }
  }
  return response
};

export const main = middyfy(getProductById);
