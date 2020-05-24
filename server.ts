import { Application } from "./deps.ts";
import { config } from "./deps.ts";
import ProductRoute from "./router/routes.ts";

const env = config();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "localhost";

const app = new Application();

app.use(ProductRoute.routes());
app.use(ProductRoute.allowedMethods());

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
