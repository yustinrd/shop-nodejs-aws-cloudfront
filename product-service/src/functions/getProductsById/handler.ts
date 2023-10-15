import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {products} from "@functions/mock";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;
  const product = products.find(item => item.id === productId)
  const response =  formatJSONResponse({product});

  if(!product) {
    response.statusCode = 404;
  }

  return response;
};

export const main = middyfy(getProductById);
