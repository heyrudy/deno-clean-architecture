import { GetProductByIdUsecase } from "../core/usecases/get_product_by_id_usecase.ts";
import { UpdateProductByIdUsecase } from "./../core/usecases/update_product_by_id_usecase.ts";
import { ProductMockRepository } from "../data/repository/product-mock-repository/product_mock_repository.ts";
import { ProductMockRepositoryMapper } from "../data/repository/product-mock-repository/product_mock_repository_mapper.ts";

const mapper = new ProductMockRepositoryMapper();
const data = new ProductMockRepository(mapper);
const usecaseGetProductById = new GetProductByIdUsecase(data);
const usecaseUpdate = new UpdateProductByIdUsecase(data);

// @desc	Update product
// @route	PUT /api/v1/products/:id
export const updateProduct = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  const product = usecaseGetProductById.execute(params.id);
  if (product) {
    const body = await request.body();
    const updateData: {
      id: string;
      name: string;
      description: string;
      price: number;
    } = { id: params.id, ...body.value };

    const products = usecaseUpdate.execute(updateData);

    response.status = 200;
    response.body = {
      status: true,
      data: products,
    };
  } else {
    response.status = 404;
    response.body = {
      status: false,
      msg: `Product with id: ${params.id} was not found`,
    };
  }
};
