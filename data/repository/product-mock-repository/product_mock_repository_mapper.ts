import { Product } from "../../../core/domain/product_model.ts";
import { v4 } from "./../../../deps.ts";
import { ProductMockEntity } from "./product_mock_entity.ts";
import { Mapper } from "../../../core/base/mapper.ts";

export class ProductMockRepositoryMapper
  implements Mapper<ProductMockEntity, Product> {
  mapFrom(param: ProductMockEntity): Product {
    return {
      name: param.name,
      description: param.description,
      price: param.price,
    };
  }

  mapTo(param: Product): ProductMockEntity {
    return {
      id: v4.generate(),
      name: param.name,
      description: param.description,
      price: param.price,
    };
  }
}
