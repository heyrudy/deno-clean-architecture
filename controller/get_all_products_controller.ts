import { GetAllProductsUsecase } from "../core/usecases/get_all_products_usecase.ts";
import { ProductMockRepository } from "../data/repository/product-mock-repository/product_mock_repository.ts";
import { ProductMockRepositoryMapper } from "../data/repository/product-mock-repository/product_mock_repository_mapper.ts";

const mapper = new ProductMockRepositoryMapper();
const data = new ProductMockRepository(mapper);
const usecase = new GetAllProductsUsecase(data);

// @desc	Get all products
// @route	GET /api/v1/products
export const getProducts = ({ response }: { response: any }) => {
  const products = usecase.execute();

  response.status = 200;
  response.body = {
    success: true,
    data: products,
  };
};
