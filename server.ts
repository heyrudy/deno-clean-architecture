import { Application } from "./deps.ts";
import { config } from "./deps.ts";
import router from "./routes.ts";

const env = config();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "localhost";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
