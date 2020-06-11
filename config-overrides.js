const {
    override,
    addLessLoader,
} = require("customize-cra");

module.exports = override(
    //添加lessloader
    addLessLoader({
        javascriptEnabled: true,
    }),
)