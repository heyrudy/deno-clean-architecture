import { Router } from "./deps.ts";
import { getProducts } from "./controller/get_all_products_controller.ts";
import { getProduct } from "./controller/get_product_by_id_controller.ts";
import { addProduct } from "./controller/add_product_controller.ts";
import { updateProduct } from "./controller/update_product_by_id_controller.ts";
import { deleteProduct } from "./controller/delete_product_by_id_controller.ts";

const router = new Router();

router.get("/api/v1/products", getProducts)
  .get("/api/v1/products/:id", getProduct)
  .post("/api/v1/products", addProduct)
  .put("/api/v1/products/:id", updateProduct)
  .delete("/api/v1/products/:id", deleteProduct);

export default router;
