/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/prop-types */

import React, { createElement, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { render } from 'react-dom'
import { getConfig } from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import { Box, useMultiStyleConfig, Text, Link } from '@chakra-ui/react'
import useNavigation from '../../hooks/use-navigation'
import useMultiSite from '../../hooks/use-multi-site'
import algoliasearch from 'algoliasearch/lite'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { createAutocomplete } from '@algolia/autocomplete-core';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { ProductItem } from './product-item'

import '@algolia/autocomplete-theme-classic';

function AlgoliaAutocomplete(props) {
    const containerRef = useRef(null)
    const navigate = useNavigation()
    const { buildUrl } = useMultiSite()
    const styles = useMultiStyleConfig('AlgoliaAutocomplete')

    let { app: algoliaConfig } = useMemo(() => getConfig(), [])
    algoliaConfig = {
        ...algoliaConfig.algolia
    }

    const productIndexName = algoliaConfig.indices.primary.value

    const searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);

    const itemClicked = useCallback(
        (e) => {
            e.preventDefault()
            navigate(`/search?q=${e.target.outerText}`);
            setShowSearchBox(false);
            autocomplete.setIsOpen(false);
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
        transformSource({ source }) {
            return {
                ...source,
                getItemUrl({ item }) {
                    return buildUrl(`/search?q=${item.query}`)
                },
            }
        }
    })

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
        key: 'recentSearch',
        limit: 4,
        transformSource({ source }) {
            return {
                ...source,
                getItemUrl({ item }) {
                    return buildUrl(`/search?q=${item.query}`)
                },
            }
        }
    })

    const startState = props && props.showSearchBox && (props.showSearchBox == "true");
    const [showSearchBox, setShowSearchBox] = useState(startState);

    const [autocompleteState, setAutocompleteState] = useState({});

    const productsContainer = (query) => {

        return {
            sourceId: 'products',
            getItemInputValue({ item }) {
                return item.query;
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
            },
            getItemUrl({ item }) {
                return item.url;
            },
        }
    };
    const autocomplete = useMemo(() => createAutocomplete({
        plugins: [recentSearchesPlugin, querySuggestionsPlugin],
        placeholder: 'Search products',
        openOnFocus: true,
        insights: true,
        id: 'autocomplete-0',
        onStateChange({ state }) {
            // (2) Synchronize the Autocomplete state with the React state.
            console.log(`autocomplete state is open ${state.isOpen}`, state);
            setAutocompleteState(state);
        },
        getSources({ query }) {
            return [
                productsContainer(query)
            ]
        },
        onSubmit({ state }) {
            navigate(`/search?q=${state.query}`)
        },
        onSelect({ state }) {
            navigate(`/search?q=${state.query}`)
        },
        onReset({ state }) {
            onResetCalled(state);
        }
    }), []);

    const collectionsProvider = (collections, callback) => {
        let recentSearches;
        let querySuggestions;
        let products;
        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            if (collection.source.sourceId == 'products') {
                products = collection;
            }
            if (collection.source.sourceId == 'querySuggestionsPlugin') {
                querySuggestions = collection;
            }
            if (collection.source.sourceId == 'recentSearchesPlugin') {
                recentSearches = collection;
            }
        }
        return callback(recentSearches, querySuggestions, products);
    }

    const onClickHandler = (e) => {
        setShowSearchBox(true);
    }

    const inputRef = useRef(null);
    const formRef = useRef(null);
    const panelRef = useRef(null);

    const { getEnvironmentProps } = autocomplete;

    useEffect(() => {
        if (!(formRef.current && panelRef.current && inputRef.current)) {
            return;
        }

        const { onTouchStart, onTouchMove, onMouseDown } = getEnvironmentProps({
            formElement: formRef.current,
            panelElement: panelRef.current,
            inputElement: inputRef.current,
        });

        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('mousedown', onMouseDown);

        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mousedown', onMouseDown);
        };
    }, [getEnvironmentProps, autocompleteState.isOpen]);


    const pluginsContainer = (plugin, title) => {

        console.log(`plugin ${title}`, plugin);
        if (typeof (plugin) !== 'undefined' && plugin.items.length > 0) {
            return (
                <>
                    <Box>
                        <Text className="aa-SourceHeaderTitle">{title}</Text>
                        <Box className="aa-SourceHeaderLine" />
                    </Box>
                    <div className="aa-List" {...autocomplete.getListProps()}>
                        {plugin.items.map((item) => (
                            <Link key={item.objectID} className="aa-ItemLink" onClick={itemClicked}>
                                <Box className="aa-ItemWrapper" >
                                    <Box className="aa-ItemIcon aa-ItemIcon--noBorder">
                                        <SearchIcon />
                                    </Box>
                                    <Box className="aa-ItemContent">
                                        <Box className="aa-ItemContentBody">
                                            <Box className="aa-ItemContentTitle">
                                                <Text>{item.query || item.label}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>
                        ))}
                    </div>
                </>
            )
        }
    }

    const onResetCalled = (state) => {
        console.log(`onResetCalled(${state})`);
        autocomplete.setIsOpen(false);
        setShowSearchBox(false);
    }

    return (
        <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
            {showSearchBox ? (
                <form
                    ref={formRef}
                    className="aa-Form"
                    {...autocomplete.getFormProps({ inputElement: inputRef.current })}
                >
                    <div className="aa-InputWrapperPrefix">
                        <label className="aa-Label" {...autocomplete.getLabelProps({})}>
                            <button className="aa-SubmitButton" type="submit" title="Submit">
                                <SearchIcon />
                            </button>
                        </label>
                    </div>
                    <div className="aa-InputWrapper">
                        <input
                            className="aa-Input"
                            ref={inputRef}
                            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
                        />
                    </div>
                    <div className="aa-InputWrapperSuffix">
                        <button className="aa-ClearButton" title="Clear" type="reset">
                            <ClearIcon />
                        </button>
                    </div>
                </form>) : (<button onClick={onClickHandler}>
                    <Box className="aa-ItemIcon aa-ItemIcon--noBorder">
                        <SearchIcon />
                    </Box>
                </button>)}
            <div ref={panelRef} className={[
                'aa-Panel',
                autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
            ]
                .filter(Boolean)
                .join(' ')}
                {...autocomplete.getPanelProps({})}>
                {autocompleteState.isOpen &&
                    collectionsProvider(autocompleteState.collections, (recentSearches, querySuggestions, products) => {
                        const productSource = products.source;

                        return (
                            <Box sx={styles}>
                                <Box className="aa-PanelSections">
                                    <Box className="aa-PanelSection--left">
                                        {pluginsContainer(recentSearches, 'Recent Searches')}
                                        {pluginsContainer(querySuggestions, 'Query Suggestions')}
                                    </Box>
                                    <Box className="aa-PanelSection--right aa-Products">
                                        <Box>
                                            <Text className="aa-SourceHeaderTitle">Products</Text>
                                            <Box className="aa-SourceHeaderLine" />
                                        </Box>
                                        {products.items.length > 0 && (
                                            <div className="aa-List" {...autocomplete.getListProps()}>
                                                {products.items.map((item) => (
                                                    <ProductItem key={item.objectID} hit={item} className="aa-Item" {...autocomplete.getItemProps({
                                                        item,
                                                        productSource,
                                                    })} />
                                                ))}
                                            </div>
                                        )}

                                    </Box>
                                </Box>
                            </Box>
                        )
                    })}
            </div>
        </div>
    );
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
        </svg>
    )
}
function ClearIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}


export default AlgoliaAutocomplete
