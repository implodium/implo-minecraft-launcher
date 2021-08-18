const path = require('path')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.ts',
    target: 'electron-main',
    mode: "development",
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist/electron')
    },
    ignoreWarnings: [
        {
            module: /cpu.js/
        }
    ],
    watchOptions: {
        poll: 1000
    }
}
