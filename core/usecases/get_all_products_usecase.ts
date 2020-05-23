import { UseCase } from "../base/use_case.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class GetAllProductsUsecase implements
  UseCase<
    void,
    Array<{ id: string; name: string; description: string; price: number }>
  > {
  constructor(private repository: ProductMockRepository) {}

  execute(): Array<
    { id: string; name: string; description: string; price: number }
  > {
    return this.repository.getAllProducts();
  }
}
