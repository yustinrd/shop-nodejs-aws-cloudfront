import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { v4 as uuidv4 } from 'uuid';
import { createProductInDB, createStockInDB } from '@services/db';
import { middyfy } from '@libs/lambda';

import schema from './schema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const id = uuidv4();
    console.log('event', event);

    const { description, title, price, count } = event.body;

    await createProductInDB({
      description,
      title,
      price,
      id
    });
    await createStockInDB({
      count,
      product_id: id
    });

    return formatJSONResponse({
      message: "Product created"
    });
  } catch ({message}) {
    return {
      ...formatJSONResponse(
          {
            message
          }),
      statusCode: 500
    }
  }
};

export const main = middyfy(createProduct);
