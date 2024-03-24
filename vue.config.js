const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
const path = require('path');
const themePath = path.resolve(__dirname, 'src/assets/style/theme.less');

module.exports = {
    // 关闭eslint检查
    lintOnSave: false,
    // 配置css前缀,px转rem
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import "${themePath}";`
                }
            },
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ["*"]
                    })
                ]
            }
        }
    },

    configureWebpack: {
        externals: {
            axios: "axios" // 配置使用CDN
        }
    },

    devServer: {
        port: 8022,
        disableHostCheck: true,
        proxy: {
            // 只要请求地址有'api'都会匹配上
            "/api": {
                target: "http://117.72.35.233",
                ws: true,
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "" //通过pathRewrite重写地址，将前缀/api转为/
                }
            }
        }
    }
};
