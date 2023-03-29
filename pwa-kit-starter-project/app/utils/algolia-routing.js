/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {history} from 'instantsearch.js/es/lib/routers'

const indexName = 'zzsb_032_dx__NTOManaged__products__default'

export const algoliaRouting = {
    router: history(
    //     {
    //     windowTitle({category, query}) {
    //         const queryTitle = query ? `Results for "${query}"` : 'Search'

    //         if (category) {
    //             return `${category} - ${queryTitle}`
    //         }

    //         return queryTitle
    //     },
    //     createURL({qsModule, routeState, location}) {
    //         let catId = (routeState.categories)? routeState.categories.toLowerCase() : null
    //         if ( catId == 'footwear') catId = 'shoes'
    //         const searchPath = catId
    //             ? `/category/${catId}/`
    //             : routeState.q
    //             ? `/search?q=${routeState.q}`
    //             : '/'
    //         console.log(`createURL(${searchPath}) from ${routeState.categories} or ${routeState.q}`)
    //         return searchPath
    //     },

    //     parseURL({qsModule, location}) {
    //         const pathnameMatches = location.pathname.split('/')
    //         let query = ''
    //         let category = ''
    //         if (pathnameMatches.length > 2 && pathnameMatches[1] == 'category') {
    //             category = pathnameMatches[2]
    //         } else if (pathnameMatches.length > 1 && pathnameMatches[1] == 'search') {
    //             query = qsModule.parse(location.search.slice(1))
    //         }
    //         console.log(`parseURL(${category}, ${query})`)
    //         return {
    //             query: decodeURIComponent(query),
    //             category
    //         }
    //     }
    // }
    ),
    stateMapping: {
        stateToRoute(uiState) {
            const indexUiState = uiState[indexName]
            const cat = indexUiState.menu ? indexUiState.menu['__primary_category.0'] : ''
            // console.log('stateToRoute(' + cat + ')', indexUiState)
            return {
                q: indexUiState.query,
                categories: cat
            }
        },
        routeToState(routeState) {
            console.log('routeToState', routeState)
            return {
                [indexName]: {
                    query: routeState.q,
                    menu: {
                        '__primary_category.0': routeState.categories
                    }
                }
            }
        }
    }
}
