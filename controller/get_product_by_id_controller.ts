import { GetProductByIdUsecase } from "../core/usecases/get_product_by_id_usecase.ts";
import { ProductMockRepository } from "../data/repository/product-mock-repository/product_mock_repository.ts";
import { ProductMockRepositoryMapper } from "../data/repository/product-mock-repository/product_mock_repository_mapper.ts";

const mapper = new ProductMockRepositoryMapper();
const data = new ProductMockRepository(mapper);
const usecase = new GetProductByIdUsecase(data);

// @desc	Get single product
// @route	GET /api/v1/products/:id
export const getProduct = (
  { params, response }: { params: { id: string }; response: any },
) => {
  const product = usecase.execute(params.id);

  if (product) {
    response.status = 200;
    response.body = {
      status: true,
      data: product,
    };
  } else {
    response.status = 404;
    response.body = {
      status: false,
      msg: `Product with id: ${params.id} was not found`,
    };
  }
};
