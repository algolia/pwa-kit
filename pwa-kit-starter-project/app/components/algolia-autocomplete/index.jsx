/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js'
import React, {createElement, Fragment, useEffect, useRef, useState} from 'react'
import {render} from 'react-dom'
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches'
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import {searchClient} from './searchClient'
import {ProductItem} from './product-item'
import {PopularItem} from './popular-item'
import {Box, useMultiStyleConfig, Text} from '@chakra-ui/react'
import {useSearchBox} from 'react-instantsearch-hooks-web'
import useNavigation from '../../hooks/use-navigation'

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'multi-column-layout-example',
    limit: 4
})

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: 'zzsb_032_dx__NTOManaged__products__default_query_suggestions',
    getSearchParams() {
        return {
            ...recentSearchesPlugin.data.getAlgoliaSearchParams(),
            hitsPerPage: 7
        }
    },
    transformSource({source}) {
        return {
            ...source,
            getItemUrl({item}) {
                return `/search?q=${item.query}`
            },
            sourceId: 'popularPlugin',
            getItemInputValue({item}) {
                return item.query
            },
            onSelect({setIsOpen}) {
                setIsOpen(true)
            },
            templates: {
                header() {
                    return (
                        <Box>
                            <Text className="aa-SourceHeaderTitle">Popular searches</Text>
                            <Box className="aa-SourceHeaderLine" />
                        </Box>
                    )
                },
                item(item) {
                    return <PopularItem hit={item} />
                }
            }
        }
    }
})

function AlgoliaAutocomplete(props) {
    const containerRef = useRef(null)
    const styles = useMultiStyleConfig('AlgoliaAutocomplete')
    const {query, refine: setQuery} = useSearchBox()
    const navigate = useNavigation()

    const [instantSearchUiState, setInstantSearchUiState] = useState({query})

    useEffect(() => {
        setQuery(instantSearchUiState.query)
    }, [instantSearchUiState])

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
            initialState: {query},
            onReset() {
                setInstantSearchUiState({query: ''})
            },
            onSubmit({state}) {
                const productListBox = document.querySelector('#product-list-page')
                if (!productListBox) {
                    navigate(`/search?q=${state.query}`)
                    // window.location.href = `/search?q=${state.query}`
                }
                setInstantSearchUiState({query: state.query})
            },
            onSelect({state}) {
                const productListBox = document.querySelector('#product-list-page')
                if (!productListBox) {
                    navigate(`/search?q=${state.query}`)
                    // window.location.href = `/search?q=${state.query}`
                }
                setInstantSearchUiState({query: state.query})
            },
            onStateChange({prevState, state}) {
                if (prevState.query !== state.query) {
                    setInstantSearchUiState({
                        query: state.query
                    })
                }
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
