/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import {autocomplete} from '@algolia/autocomplete-js'
import React, {useEffect, useRef} from 'react'
import {pipe} from 'ramda'

import {createFillWith, uniqBy} from './functions'
import {categoriesPlugin} from './plugins/categoriesPlugin'
import {popularCategoriesPlugin} from './plugins/popularCategoriesPlugin'
import {popularPlugin} from './plugins/popularPlugin'
import {productsPlugin} from './plugins/productsPlugin'
import {querySuggestionsPlugin} from './plugins/querySuggestionsPlugin'
import {quickAccessPlugin} from './plugins/quickAccessPlugin'
import {recentSearchesPlugin} from './plugins/recentSearchesPlugin'
import {isDetached} from './utils'
import {Box} from '@chakra-ui/react'

// import '@algolia/autocomplete-theme-classic'

const removeDuplicates = uniqBy(({source, item}) => {
    const sourceIds = ['recentSearchesPlugin', 'querySuggestionsPlugin']
    if (sourceIds.indexOf(source.sourceId) === -1) {
        return item
    }

    return source.sourceId === 'querySuggestionsPlugin' ? item.query : item.label
})

const fillWith = createFillWith({
    mainSourceId: 'querySuggestionsPlugin',
    limit: isDetached() ? 6 : 10
})

const combine = pipe(removeDuplicates, fillWith)

export function Autocomplete(props) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            placeholder: 'Search products',
            autoFocus: true,
            openOnFocus: true,
            plugins: [
                recentSearchesPlugin,
                querySuggestionsPlugin,
                categoriesPlugin,
                productsPlugin,
                popularPlugin,
                quickAccessPlugin,
                popularCategoriesPlugin
            ],
            reshape({sourcesBySourceId, sources, state}) {
                const {
                    recentSearchesPlugin: recentSearches,
                    querySuggestionsPlugin: querySuggestions,
                    categoriesPlugin: categories,
                    popularPlugin: popular,
                    popularCategoriesPlugin: popularCategories,
                    ...rest
                } = sourcesBySourceId

                const sourceIdsToExclude = ['popularPlugin', 'popularCategoriesPlugin']
                const shouldDisplayPopularCategories = sources.every((source) => {
                    if (sourceIdsToExclude.indexOf(source.sourceId) !== -1) {
                        return true
                    }
                    return source.getItems().length === 0
                })

                return [
                    combine(recentSearches, querySuggestions, categories),
                    [
                        !state.query && popular,
                        ...Object.values(rest),
                        shouldDisplayPopularCategories && popularCategories
                    ].filter(Boolean)
                ]
            }
        })

        return () => {
            search.destroy()
        }
    }, [])

    return <Box ref={containerRef} />
}
