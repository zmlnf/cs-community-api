import app from "./app/app.js";
import cors from 'cors'
import config from "./app/config.js";
import loadRouter from "./router/index.js";

const bootStrap = () => {
  loadRouter();
  app.use(cors())
  app.listen(config.PORT, () => {
    console.log(`server is running on ${config.PORT} port`);
  });
};

bootStrap();
