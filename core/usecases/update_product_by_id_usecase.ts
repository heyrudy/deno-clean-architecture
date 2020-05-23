import { UseCase } from "../base/use_case.ts";
import { Product } from "../domain/product_model.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class UpdateProductByIdUsecase
  implements
    UseCase<
      { id: number; name: string; description: string; price: number },
      Array<Product>
    > {
  constructor(private repository: ProductMockRepository) {}

  execute(
    param: { id: number; name: string; description: string; price: number },
  ): Array<Product> {
    return this.repository.updateProductById(param);
  }
}
