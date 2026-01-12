const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
    path.join(__dirname, '../../tsconfig.json'),
    ['shared-lib']);

module.exports = {
    output: {
        uniqueName: "retail",
        publicPath: "auto",
        scriptType: "module"
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
    optimization: {
        runtimeChunk: false
    },
    resolve: {
        alias: {
            ...sharedMappings.getAliases()
        }
    },
    experiments: {
        outputModule: true
    },
    plugins: [
        new ModuleFederationPlugin({
            library: { type: "module" },
            name: "retail",
            filename: "remoteEntry.js",
            exposes: {
                './Module': './projects/retail/src/app/retail.module.ts',
            },

            shared: share({
                "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

                ...sharedMappings.getDescriptors()
            })

        }),
        sharedMappings.getPlugin()
    ],
};
