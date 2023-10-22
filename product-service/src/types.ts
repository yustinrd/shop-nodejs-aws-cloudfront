export type Product = {
    description: string,
    id: string,
    price: number,
    title: string,
    count: number,
}

export type Stock = {
    product_id: string,
    count: number,
}
