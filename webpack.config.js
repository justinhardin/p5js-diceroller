module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "diceroller.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/
            }
        ]
    }
};