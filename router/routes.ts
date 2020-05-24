import { Router } from "../deps.ts";
import { getProducts } from "../controller/get_all_products_controller.ts";
import { getProduct } from "../controller/get_product_by_id_controller.ts";
import { addProduct } from "../controller/add_product_controller.ts";
import { updateProduct } from "../controller/update_product_by_id_controller.ts";
import { deleteProduct } from "../controller/delete_product_by_id_controller.ts";

const router = new Router({prefix: '/api/v1'});

router.get("/products", getProducts)
  .get("/products/:id", getProduct)
  .post("/products", addProduct)
  .put("/products/:id", updateProduct)
  .delete("/products/:id", deleteProduct);

export default router;
