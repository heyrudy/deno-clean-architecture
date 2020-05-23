import { ProductMockRepositoryMapper } from "./product_mock_repository_mapper.ts";
import { ProductRepository } from "../../../core/repositories/product_repository.ts";
import { Product } from "../../../core/domain/product_model.ts";
import { ProductMockEntity } from "./product_mock_entity.ts";

export class ProductMockRepository extends ProductRepository {
  products: Array<ProductMockEntity> = [
    {
      id: 1,
      name: "Product one",
      description: "This is product one",
      price: 29.99,
    },
    {
      id: 2,
      name: "Product two",
      description: "This is product two",
      price: 39.99,
    },
    {
      id: 3,
      name: "Product three",
      description: "This is product three",
      price: 59.99,
    },
  ];

  constructor(private mapper: ProductMockRepositoryMapper) {
    super();
  }

  getAllProducts(): Array<Product> {
    return this.products.map(this.mapper.mapFrom);
  }

  getProductById(id: number): Product {
    return this.products.filter((p) => p.id === id).map(this.mapper.mapFrom)[0];
  }

  addProduct(param: Product): ProductMockEntity {
    const newProduct = this.mapper.mapTo(param);
    this.products = [...this.products, newProduct];
    return newProduct;
  }

  updateProductById(param: ProductMockEntity): Array<Product> {
    return this.products.map((p) => p.id === param.id ? { ...p, ...param } : p)
      .map(this.mapper.mapFrom);
  }

  deleteProductById(id: number): Array<Product> {
    return this.products.splice(id, 1).map(this.mapper.mapFrom);
  }
}
