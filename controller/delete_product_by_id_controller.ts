import { DeleteProductByIdUsecase } from "../core/usecases/delete_product_by_id_usecase.ts";
import { ProductMockRepository } from "../data/repository/product-mock-repository/product_mock_repository.ts";
import { ProductMockRepositoryMapper } from "../data/repository/product-mock-repository/product_mock_repository_mapper.ts";

const mapper = new ProductMockRepositoryMapper();
const data = new ProductMockRepository(mapper);
const usecase = new DeleteProductByIdUsecase(data);

// @desc	Delete product
// @route	DELETE /api/v1/products/:id
export const deleteProduct = (
  { params, response }: { params: { id: string }; response: any },
) => {
  const products = usecase.execute(parseInt(params.id));

  response.status = 200;
  response.body = {
    status: true,
    data: products,
  };
};
