const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: './bundle.js',
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env"
                    ]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            }
        ],
    },
};
