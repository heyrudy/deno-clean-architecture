import { UseCase } from "../base/use_case.ts";
import { Product } from "../domain/product_model.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class DeleteProductByIdUsecase
  implements UseCase<number, Array<Product>> {
  constructor(private repository: ProductMockRepository) {}

  execute(param: number): Array<Product> {
    return this.repository.deleteProductById(param);
  }
}
