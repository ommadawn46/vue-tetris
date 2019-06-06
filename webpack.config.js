const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public/js')
    },
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
            }
        ],
    },
};