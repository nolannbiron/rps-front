const webpack = require('webpack')
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
    }
    config.plugins.push(
        new webpack.ProvidePlugin({
            // process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
            'react/jsx-runtime.js': 'react/jsx-runtime',
        })
    )
    config.module.rules.push({
        test: /\.(ts)x?$/, // Just `tsx?` file only
        use: [
            // options.defaultLoaders.babel, I don't think it's necessary to have this loader too
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                    onlyCompileBundledFiles: true,
                },
            },
        ],
    })

    return config
}
