/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/prop-types */

import React, {createElement, Fragment, useCallback, useEffect, useMemo, useRef} from 'react'
import {render} from 'react-dom'
import {getConfig} from 'pwa-kit-runtime/utils/ssr-config'
import {Box, useMultiStyleConfig, Text, Link} from '@chakra-ui/react'
import useNavigation from '../../hooks/use-navigation'
import useMultiSite from '../../hooks/use-multi-site'
import algoliasearch from 'algoliasearch/lite'
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js'
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches'
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import {ProductItem} from './product-item'

function AlgoliaAutocomplete() {
    const containerRef = useRef(null)
    const navigate = useNavigation()
    const {buildUrl} = useMultiSite()
    const styles = useMultiStyleConfig('AlgoliaAutocomplete')

    let {app: algoliaConfig} = useMemo(() => getConfig(), [])
    algoliaConfig = {
        ...algoliaConfig.algolia
    }

    const productIndexName = algoliaConfig.indices.primary.value

    const searchClient = useMemo(() => {
        return algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)
    }, [])

    const itemClicked = useCallback(
        (e) => {
            e.preventDefault()
            navigate(`/search?q=${e.target.outerText}`)
        },
        [navigate]
    )

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
        searchClient,
        indexName: algoliaConfig.indices.querySuggestions,
        getSearchParams() {
            return {
                hitsPerPage: 7
            }
        },
        transformSource({source}) {
            return {
                ...source,
                getItemUrl({item}) {
                    return buildUrl(`/search?q=${item.query}`)
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
                    item({item, components}) {
                        return (
                            <Link className="aa-ItemLink" onClick={itemClicked}>
                                <Box className="aa-ItemWrapper">
                                    <Box className="aa-ItemIcon aa-ItemIcon--noBorder">
                                        <SearchIcon />
                                    </Box>
                                    <Box className="aa-ItemContent">
                                        <Box className="aa-ItemContentBody">
                                            <Box className="aa-ItemContentTitle">
                                                <components.Highlight
                                                    hit={item}
                                                    attribute="query"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>
                        )
                    }
                }
            }
        }
    })

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
        key: 'recentSearch',
        limit: 4,
        transformSource({source}) {
            return {
                ...source,
                getItemUrl({item}) {
                    return buildUrl(`/search?q=${item.query}`)
                },
                templates: {
                    header() {
                        return (
                            <Box>
                                <Text className="aa-SourceHeaderTitle">Recent searches</Text>
                                <Box className="aa-SourceHeaderLine" />
                            </Box>
                        )
                    },
                    item({item}) {
                        return (
                            <Link className="aa-ItemLink" onClick={itemClicked}>
                                <Box className="aa-ItemWrapper">
                                    <Box className="aa-ItemIcon aa-ItemIcon--noBorder">
                                        <SearchIcon />
                                    </Box>
                                    <Box className="aa-ItemContent">
                                        <Box className="aa-ItemContentBody">
                                            <Box className="aa-ItemContentTitle">
                                                <Text>{item.label}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>
                        )
                    }
                }
            }
        }
    })

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: {createElement, Fragment, render},
            plugins: [recentSearchesPlugin, querySuggestionsPlugin],
            placeholder: 'Search products...',
            panelPlacement: 'full-width',
            autoFocus: false,
            openOnFocus: false,
            debug: false,
            getSources({query}) {
                return [
                    {
                        sourceId: 'products',
                        templates: {
                            header() {
                                return (
                                    <Box>
                                        <Text className="aa-SourceHeaderTitle">Products</Text>
                                        <Box className="aa-SourceHeaderLine" />
                                    </Box>
                                )
                            },
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
                                        indexName: productIndexName,
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
            onSubmit({state}) {
                navigate(`/search?q=${state.query}`)
            },
            onSelect({state}) {
                navigate(`/search?q=${state.query}`)
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
    }, [])

    return <div ref={containerRef} />
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
        </svg>
    )
}

export default AlgoliaAutocomplete
