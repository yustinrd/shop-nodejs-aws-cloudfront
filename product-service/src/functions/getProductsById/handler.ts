import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { getProductsByIdFromDB, getStockByIdFromDB } from '@services/db';
import { middyfy } from '@libs/lambda';

import schema from './schema';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let product;
  let stock;
  let response;
  console.log('event', event);

  try {
    const { productId } = event.pathParameters;
    [product, stock] = await Promise.all([getProductsByIdFromDB(productId), getStockByIdFromDB(productId)]);

      response = formatJSONResponse({product: {
      ...product,
        count: stock?.count || 0
      }});
  } catch ({message}) {
    return {
      ...formatJSONResponse(
          {
            message
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
