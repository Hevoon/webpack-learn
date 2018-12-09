/*必须阅读：
webpack配置即是js文件，或者说是一个导出对象的js文件，导出后的对象由 webpack 根据对象定义的属性进行解析
通过 require(...) 导入其他文件
通过 require(...) 使用 npm 的工具函数
使用 JavaScript 控制流表达式，例如 ?: 操作符
对常用值使用常量或变量
编写并执行函数来生成部分配置

注意：
虽然技术上可行，但应避免以下做法，
在使用 webpack 命令行接口(CLI)（应该编写自己的命令行接口(CLI)，或使用 --env）时，访问命令行接口(CLI)参数
导出不确定的值（调用 webpack 两次应该产生同样的输出文件）
编写很长的配置（应该将配置拆分为多个文件）
*/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        main: './src/main.js'//单个入口

        // app1: './src/main.js',
        // app2: './src/other.js'//多个入口

        // main: ['./src/main.js', './src/other.js']//会将多个入口导入的依赖文件一起注入，并将导向传入一个chunk中。

        // app:'./src/main.js',
        // vendors:'./src/vue.js'//对象语法,含有第三方库引用
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: './src',//本地服务器加载的页面所在目录,默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
        // port:'1010',//设置默认监听端口，如果省略，默认为”8080“
        historyApiFallback: true,//不跳转,在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true//实时刷新
    },//启用该服务器，可以自定刷新打包后的页面，当我们修改源码的时候，打包后的代码也会更变了
    devtool: "source-map",//在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；source-map可以在Chrome浏览器中使用，报错的时候可以直接显示出源码，而不是打包后的文
    // devtool: "cheap-module-source-map",//在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
    // devtool: "eval-source-map",//使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；
    // devtool: "cheap-module-eval-source-map",//这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"//style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。
                    },
                    {
                        loader: "css-loader",//css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }//style必须写在css前面
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        // options: {
                        //     presets: [
                        //         'env'
                        //     ]//设置babel的预设，引入需要用到的插件组等等
                        // }    //webpack会自动调用.babelrc文件里面的配置选项
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },//配置loader,loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个.
    // 以上配置中，对一个单独的 module 对象定义了rules属性，里面包含两个必须属性：test 和 use.
    // 这告诉webpack编译器(compiler) 如下信息：“嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先使用 raw-loader 转换一下。”
    //webpack解释模块时，resolver 帮助 webpack 找到 bundle 中需要引入的模块代码，这些代码在包含在每个 require/import 语句中，当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/webpack-template.html"//指定模板，这里必须写绝对路径
        }),
        new webpack.BannerPlugin("版权必究"),
        new webpack.HotModuleReplacementPlugin()
    ],//在该文件上部引入后，在plugins属性中应用
    mode: "production"//启用模式
};