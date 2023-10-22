import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { getProductsListFromDB, getStocksListFromDB } from '@services/db';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const mergeTo = (product, stocks) => {
  return product.map(product => ({
    ...product,
    count: stocks.find(({product_id}) => product_id === product.id).count || 0
  }))
}

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('event', event);

  try {
    const [products, stocks] = await Promise.all([getProductsListFromDB(),getStocksListFromDB() ]);
    const result = mergeTo(products, stocks);

    return formatJSONResponse({products: result});
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

export const main = middyfy(getProductsList);
