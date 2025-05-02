const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig, { env, paths }) => {
            // Remove React Refresh from production builds
            if (env === 'production') {
                const babelLoaderIndex = webpackConfig.module.rules[1].oneOf.findIndex(
                    (rule) => rule.loader && rule.loader.includes('babel-loader')
                );

                if (babelLoaderIndex !== -1) {
                    const babelLoader = webpackConfig.module.rules[1].oneOf[babelLoaderIndex];
                    if (babelLoader.options && babelLoader.options.plugins) {
                        babelLoader.options.plugins = babelLoader.options.plugins.filter(
                            (plugin) => {
                                if (typeof plugin === 'string') {
                                    return !plugin.includes('react-refresh');
                                }
                                return true;
                            }
                        );
                    }
                }
            }
            return webpackConfig;
        },
    },
};