/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import {PopularItem} from './popular-item'

import {Box, Text} from '@chakra-ui/react'
import {searchClient} from '../searchClient'

export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: 'zzsb_032_dx__NTOManaged__products__default_query_suggestions',
    getSearchParams() {
        return {
            hitsPerPage: 7
        }
    },
    transformSource({source}) {
        return {
            ...source,
            getItemUrl({item}) {
                return `/search?q=${item.query}`
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
                item({html, item, components}) {
                    return <PopularItem html={html} hit={item} components={components} />
                }
            }
        }
    }
})
