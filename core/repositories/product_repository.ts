import { Product } from "../domain/product_model.ts";

export abstract class ProductRepository {
  abstract getAllProducts(): Product[];
  abstract getProductById(id: number): Product;
  abstract addProduct(
    param: Product,
  ): { id: number; name: string; description: string; price: number };
  abstract updateProductById(
    param: { id: number; name: string; description: string; price: number },
  ): Product[];
  abstract deleteProductById(id: number): Product[];
}
