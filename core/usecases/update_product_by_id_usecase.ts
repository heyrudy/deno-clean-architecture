import { UseCase } from "../base/use_case.ts";
import { ProductMockRepository } from "../../data/repository/product-mock-repository/product_mock_repository.ts";

export class UpdateProductByIdUsecase implements
  UseCase<
    { id: string; name: string; description: string; price: number },
    Array<{ id: string; name: string; description: string; price: number }>
  > {
  constructor(private repository: ProductMockRepository) {}

  execute(
    param: { id: string; name: string; description: string; price: number },
  ): Array<{ id: string; name: string; description: string; price: number }> {
    return this.repository.updateProductById(param);
  }
}
