/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches'
import React from 'react'
import {RecentItem} from './recent-item'
import {Box, Text} from '@chakra-ui/react'

export const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'multi-column-layout-example',
    limit: 4,
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
                            <Text className="aa-SourceHeaderTitle">Recent searches</Text>
                            <Box className="aa-SourceHeaderLine" />
                        </Box>
                    )
                },
                item({html, item, components}) {
                    return <RecentItem html={html} hit={item} components={components} />
                }
            }
        }
    }
})
