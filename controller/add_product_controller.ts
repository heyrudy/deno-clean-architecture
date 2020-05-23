import { AddProductUsecase } from "../core/usecases/add_product_usecase.ts";
import { ProductMockRepository } from "../data/repository/product-mock-repository/product_mock_repository.ts";
import { ProductMockRepositoryMapper } from "../data/repository/product-mock-repository/product_mock_repository_mapper.ts";

const mapper = new ProductMockRepositoryMapper();
const data = new ProductMockRepository(mapper);
const usecase = new AddProductUsecase(data);

// @desc	Add product
// @route	POST /api/v1/products
export const addProduct = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();

  if (request.hasBody) {
    const product: { name: string; description: string; price: number } =
      body.value;
    const newProduct: {
      id: string;
      name: string;
      description: string;
      price: number;
    } = usecase.execute(product);

    response.status = 201;
    response.body = {
      status: true,
      data: newProduct,
    };
  } else {
    response.status = 400;
    response.body = {
      status: false,
      msg: "No data",
    };
  }
};
