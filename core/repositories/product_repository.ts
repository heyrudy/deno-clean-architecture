import { Product } from "../domain/product_model.ts";

export abstract class ProductRepository {
  abstract getAllProducts(): Array<
    { id: string; name: string; description: string; price: number }
  >;
  abstract getProductById(id: string): Product;
  abstract addProduct(
    param: Product,
  ): { id: string; name: string; description: string; price: number };
  abstract updateProductById(
    param: { id: string; name: string; description: string; price: number },
  ): Array<{ id: string; name: string; description: string; price: number }>;
  abstract deleteProductById(
    id: string,
  ): Array<{ id: string; name: string; description: string; price: number }>;
}
