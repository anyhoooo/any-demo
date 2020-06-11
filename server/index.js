const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("koa2-cors");
const index = require("./routers/index");

const app = new Koa();

app.use(
    koaBody()
);
app.use(cors()); //解决跨域问题

app.use(index.routes(), index.allowedMethods());
app.listen(3001);