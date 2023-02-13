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

import {autocomplete} from '@algolia/autocomplete-js'
import React, {createElement, Fragment, useEffect, useRef} from 'react'
import {render} from 'react-dom'
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches'
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')
const searchIndex = 'zzsb_032_dx__NTOManaged__products__default_query_suggestions'

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'navbar'
})

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: searchIndex,
    getSearchParams() {
        return recentSearchesPlugin.data.getAlgoliaSearchParams()
    }
})

export function Autocomplete(props) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: {createElement, Fragment, render},
            plugins: [recentSearchesPlugin, querySuggestionsPlugin],
            onSubmit({state}) {
                console.log('onSubmit', state)
                window.location.href = `/search?q=${state.query}`
            },
            onSelect({state}) {
                console.log('onSelect', state)
                window.location.href = `/search?q=${state.query}`
            },
            onReset() {
                console.log('onReset')
            },
            ...props
        })

        return () => {
            search.destroy()
        }
    }, [props])

    return <div ref={containerRef} />
}
