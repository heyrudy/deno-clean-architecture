import { UseCase } from "../base/use_case.ts";
import { Product } from "../domain/product_model.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class GetProductByIdUsecase
  implements UseCase<string, Product | undefined> {
  constructor(private repository: ProductMockRepository) {}

  execute(id: string): Product | undefined {
    return this.repository.getProductById(id);
  }
}
