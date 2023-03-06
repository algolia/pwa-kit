/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js'
import React, {createElement, Fragment, useEffect, useRef} from 'react'
import {render} from 'react-dom'
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches'
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import {searchClient} from './searchClient'
import {ProductItem} from './product-item'
import {Box, useMultiStyleConfig} from '@chakra-ui/react'

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'multi-column-layout-example',
    limit: 2
})

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: 'zzsb_032_dx__NTOManaged__products__default_query_suggestions',
    getSearchParams() {
        return {
            ...recentSearchesPlugin.data.getAlgoliaSearchParams(),
            hitsPerPage: 7
        }
    }
})

function AlgoliaAutocomplete(props) {
    const containerRef = useRef(null)
    const styles = useMultiStyleConfig('AlgoliaAutocomplete')

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: {createElement, Fragment, render},
            placeholder: 'Search products...',
            autoFocus: true,
            openOnFocus: true,
            plugins: [recentSearchesPlugin, querySuggestionsPlugin],
            ...props,
            debug: true,
            getSources({query}) {
                return [
                    {
                        sourceId: 'products',
                        templates: {
                            item({html, item, components}) {
                                return (
                                    <ProductItem html={html} hit={item} components={components} />
                                )
                            }
                        },
                        getItems() {
                            return getAlgoliaResults({
                                searchClient,
                                queries: [
                                    {
                                        indexName: 'zzsb_032_dx__NTOManaged__products__default',
                                        query,
                                        params: {
                                            hitsPerPage: 4
                                        }
                                    }
                                ]
                            })
                        }
                    }
                ]
            },
            onSubmit: ({state}) => {
                window.location.href = `/search?q=${state.query}`
            },
            onSelect: ({state}) => {
                window.location.href = `/search?q=${state.query}`
            },
            render({elements}, root) {
                const {recentSearchesPlugin, querySuggestionsPlugin, products} = elements

                render(
                    <Box sx={styles}>
                        <Box className="aa-PanelSections">
                            <Box className="aa-PanelSection--left">
                                {recentSearchesPlugin}
                                {querySuggestionsPlugin}
                            </Box>
                            <Box className="aa-PanelSection--right aa-Products">{products}</Box>
                        </Box>
                    </Box>,
                    root
                )
            }
        })

        return () => {
            search.destroy()
        }
    }, [props])

    return <div ref={containerRef} />
}

export default AlgoliaAutocomplete
