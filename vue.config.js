const {
    execSync
} = require("child_process");

//读取当前分支名称
const branch = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .replace(/\s+/, "");
//挂载分支名称到环境变量上
process.env.VUE_APP_RELEASE = branch;

const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";

module.exports = {
    lintOnSave: false,
    devServer: {
        port: 3100,
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // clientLogLevel: 'none',
        hot: true,
        // proxy: proxyTable,
    },
    configureWebpack: () => ({
        // 将 entry 指向应用程序的 server / client 文件
        entry: `./src/entry-${target}.js`,
        // 对 bundle renderer 提供 source map 支持
        devtool: "source-map",
        target: TARGET_NODE ? "node" : "web",
        node: TARGET_NODE ? undefined : false,
        output: {
            libraryTarget: TARGET_NODE ? "commonjs2" : undefined,
        },
        // https://webpack.js.org/configuration/externals/#function
        // https://github.com/liady/webpack-node-externals
        // 外置化应用程序依赖模块。可以使服务器构建速度更快，
        // 并生成较小的 bundle 文件。
        externals: TARGET_NODE ?
            nodeExternals({
                // 不要外置化 webpack 需要处理的依赖模块。
                // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
                // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
                whitelist: [/\.css$/]
            }) :
            undefined,
        optimization: {
            splitChunks: {
                chunks: "async",
                minSize: 30000,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
            },
        },
        plugins: [
            TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
        ],
    }),
    chainWebpack: (config) => {
        config.module
            .rule("lessloader")
            .test(/.less$/)
            .use("lessloader")
            .loader("vue-style-loader")
            .loader("css-loader")
            .tap(() => {
                return {
                    sourceMap: true,
                };
            })
            .loader("less-loader");
        config.module
            .rule("vue")
            .use("vue-loader")
            .tap((options) => {
                merge(options, {
                    optimizeSSR: false,
                });
            });
    },
    assetsDir: "./dist",
    outputDir: process.env.OUTPUT_DIR,
    runtimeCompiler: true,
    // productionSourceMap: process.env.NODE_ENV === 'development' ? true : false,
    productionSourceMap: process.env.VUE_APP_ENV === "production" ? false : true,
    parallel: true,
    // filenameHashing: false,
    // css: undefined,
    publicPath: process.env.VUE_APP_PUBLICPATH, //文件的发布路径
};