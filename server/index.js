const path = require("path");
const fs = require("fs");

const Koa = require("koa");
const Router = require("koa-router");
const koaStatic = require("koa-static");

const resolve = (file) => path.resolve(__dirname, file);

const app = new Koa();
const router = new Router();

const { createBundleRenderer } = require("vue-server-renderer");
const serverBundle = require("../dist/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/vue-ssr-client-manifest.json");

const template = fs.readFileSync(resolve("../dist/index.ssr.html"), "utf-8");

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: template,
  clientManifest: clientManifest,
});

// 后端Server
app.use(koaStatic(resolve("../dist")));

router.get("/home", (ctx, next) => {
  console.log("ctx", ctx);
  console.log("url", ctx.path);
  ctx.res.setHeader("Content-Type", "text/html");
  let context = {
    url: ctx.url,
  };

  const ssrStream = renderer.renderToStream(context);
  ctx.status = 200;
  ctx.type = "html";
  ctx.body = ssrStream;
});

router.get("*", (ctx, next) => {
  let html = fs.readFileSync(resolve("../dist/index.html"), "utf-8");
  ctx.type = "html";
  ctx.status = 200;
  ctx.body = html;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("服务器端渲染地址： http://localhost:3000");
});

// const fs = require("fs");
// const path = require("path");
// const Router = require("koa-router");
// const Koa = require("koa");
// const send = require("koa-send");
// const koaStatic = require("koa-static");
// const koaMount = require("koa-mount");
// const router = new Router();
// const app = new Koa();
// const resolve = (file) => path.resolve(__dirname, file);

// // 第 2 步：获得一个createBundleRenderer
// const { createBundleRenderer } = require("vue-server-renderer");
// const bundle = require("../dist/vue-ssr-server-bundle.json");
// const clientManifest = require("../dist/vue-ssr-client-manifest.json");

// const renderer = createBundleRenderer(bundle, {
//   runInNewContext: false,
//   template: fs.readFileSync(resolve("../dist/index.ssr.html"), "utf-8"),
//   clientManifest: clientManifest,
// });

// function renderToString(context) {
//   return new Promise((resolve, reject) => {
//     renderer.renderToString(context, (err, html) => {
//       err ? reject(err) : resolve(html);
//     });
//   });
// }

// // 第 3 步：添加一个中间件来处理所有请求
// const handleRequest = async (ctx, next) => {
//   const url = ctx.path;
//   console.log(url);
//   if (url.includes(".")) {
//     console.log(`proxy ${url}`);
//     return await send(ctx, url, {
//       root: path.resolve(__dirname, "../dist"),
//     });
//   }

//   ctx.res.setHeader("Content-Type", "text/html");
//   const context = {
//     title: "ssr test",
//     url,
//   };
//   // 将 context 数据渲染为 HTML
//   const html = await renderToString(context);
//   ctx.body = html;
// };
// router.get("*", handleRequest);

// app.use(router.routes()).use(router.allowedMethods());
// // 开放目录
// app.use(koaMount("/dist", koaStatic(resolve("../dist"))));
// app.use(koaMount("/public", koaStatic(resolve("../public"))));

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`server started at localhost:${port}`);
// });
// module.exports = router;
