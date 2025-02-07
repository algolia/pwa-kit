/* eslint-disable header/header */
const sites = require('./sites.js')
module.exports = {
    app: {
        // Customize how your 'site' and 'locale' are displayed in the url.
        url: {
            // Determine where the siteRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            // site: 'none',
            // Determine where the localeRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            locale: 'none'
            // This boolean value dictates whether or not default site or locale values are shown in the url. Defaults to: false
            // showDefaults: true
        },
        // The default site for your app. This value will be used when a siteRef could not be determined from the url
        defaultSite: 'NTOManaged',
        // Provide aliases for your sites. These will be used in place of your site id when generating paths throughout the application.
        // siteAliases: {
        //     RefArch: 'us'
        // },
        // The sites for your app, which is imported from sites.js
        sites,
        // Algolia api config
        algolia: {
            appId: 'YH9KIEOW1H',
            apiKey: 'b09d6dab074870f67f7682f4aabaa474',
            indices: {
                querySuggestions: 'zzsb_032_dx__NTOManaged__products__default_query_suggestions',
                primary: {
                    label: 'Sort By: Best Matches',
                    value: 'zzsb_032_dx__NTOManaged__products__default'
                },
                replicas: [
                    {
                        label: 'Sort By: Price Low to High',
                        value: 'zzsb_032_dx__NTOManaged__products__default_price_asc'
                    },
                    {
                        label: 'Sort By: Price High to Low',
                        value: 'zzsb_032_dx__NTOManaged__products__default_price_desc'
                    }
                ]
            }
        },
        // Commerce api config
        commerceAPI: {
            proxyPath: '/mobify/proxy/api',
            parameters: {
                clientId: '89da0584-f5e4-4820-8473-88ce0b86e71e',
                organizationId: 'f_ecom_zzsb_032',
                shortCode: 'kv7kzm78',
                siteId: 'NTOManaged'
            }
        },
        einsteinAPI: {
            proxyPath: '/mobify/proxy/einstein',
            einsteinId: '47ccb7e7-dd4d-4434-8d1b-a95ae5623ccf',
            siteId: 'bbms-NTO_NA'
        }
    },
    // This list contains server-side only libraries that you don't want to be compiled by webpack
    externals: [],
    // Page not found url for your app
    pageNotFoundURL: '/page-not-found',
    // Enables or disables building the files necessary for server-side rendering.
    ssrEnabled: true,
    // This list determines which files are available exclusively to the server-side rendering system
    // and are not available through the /mobify/bundle/ path.
    ssrOnly: ['ssr.js', 'ssr.js.map', 'node_modules/**/*.*'],
    // This list determines which files are available to the server-side rendering system
    // and available through the /mobify/bundle/ path.
    ssrShared: [
        'static/ico/favicon.ico',
        'static/robots.txt',
        '**/*.js',
        '**/*.js.map',
        '**/*.json'
    ],
    // Additional parameters that configure Express app behavior.
    ssrParameters: {
        ssrFunctionNodeVersion: '14.x',
        proxyConfigs: [
            {
                host: 'kv7kzm78.api.commercecloud.salesforce.com',
                path: 'api'
            },
            {
                host: 'zzte-053.dx.commercecloud.salesforce.com',
                path: 'ocapi'
            }
        ]
    }
}
