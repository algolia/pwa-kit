/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const sites = require('./sites.js')

function parseEnvVar(envVarName) {
    const val = process.env[envVarName];
    if (val === undefined) {
      throw new Error(`Environment variable ${envVarName} is required.`);
    }
    try {
      return JSON.parse(val);
    } catch (err) {
        return val;
        // throw new Error(
        // `Environment variable ${envVarName} must be a valid JSON string.`
      // );
    }
  }
module.exports = {
    app: {
        // Customize how your 'site' and 'locale' are displayed in the url.
        url: {
            // Determine where the siteRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            // site: 'none',
            // Determine where the localeRef is located. Valid values include 'path|query_param|none'. Defaults to: 'none'
            locale: 'none',
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
        algolia: {
            appId: parseEnvVar("ALGOLIA_APP_ID"),
            apiKey: parseEnvVar("ALGOLIA_API_KEY"),
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
                clientId: parseEnvVar("CLIENT_ID"),
                organizationId: parseEnvVar("ORGANIZATION_ID"),
                shortCode: parseEnvVar("SHORT_CODE"),
                siteId: parseEnvVar("SITE_ID")
            }
        },
        // Einstein api config
        einsteinAPI: {
            host: 'https://api.cquotient.com',
            einsteinId: '',
            siteId: '',
            // Flag Einstein activities as coming from a production environment.
            // By setting this to true, the Einstein activities generated by the environment will appear
            // in production environment reports
            isProduction: false
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
        ssrFunctionNodeVersion: '18.x',
        proxyConfigs: [
            {
                host: parseEnvVar("API_URL"),
                path: 'api'
            },
            {
                host: parseEnvVar("OCAPI_URL"),
                path: 'ocapi'
            }
        ]
    }
}