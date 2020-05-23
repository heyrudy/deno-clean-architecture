import { UseCase } from "../base/use_case.ts";
import { Product } from "../domain/product_model.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class AddProductUsecase
  implements
    UseCase<
      Product,
      { id: number; name: string; description: string; price: number }
    > {
  constructor(private repository: ProductMockRepository) {}

  execute(
    param: Product,
  ): { id: number; name: string; description: string; price: number } {
    return this.repository.addProduct(param);
  }
}
