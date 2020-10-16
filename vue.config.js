'use strict';

module.exports = {
    devServer: {
        port: 8080,
    },
    pwa: {
        name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
        icons: [
            {
                src: 'img/icons/android-icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
        iconPaths: {
            favicon32: 'img/icons/favicon-32x32.png',
            favicon16: 'img/icons/favicon-16x16.png',
            appleTouchIcon: 'img/icons/apple-icon-180x180.png',
            msTileImage: 'img/icons/ms-icon-150x150.png',
        }
    }
};