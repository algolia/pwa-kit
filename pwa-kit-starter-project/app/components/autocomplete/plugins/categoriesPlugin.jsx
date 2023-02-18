/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/** @jsx h */
/* eslint-disable react/prop-types */
import {getAlgoliaResults} from '@algolia/autocomplete-js'
import {h} from 'preact'

import {Breadcrumb, GridIcon} from '../components'
import {ALGOLIA_PRODUCTS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'

export const categoriesPlugin = {
    getSources({query}) {
        if (!query) {
            return []
        }

        return [
            {
                sourceId: 'categoriesPlugin',
                getItems() {
                    return getAlgoliaResults({
                        searchClient,
                        queries: [
                            {
                                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                                query,
                                params: {
                                    hitsPerPage: 1
                                }
                            }
                        ]
                    })
                },
                getItemInputValue({item}) {
                    return item.categories[item.categories.length - 1]
                },
                templates: {
                    item({item, components}) {
                        return <CategoryItem hit={item} components={components} />
                    }
                }
            }
        ]
    }
}

function CategoryItem({hit, components}) {
    return (
        <div className="aa-ItemWrapper aa-CategoryItem">
            <div className="aa-ItemContent">
                <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                    <GridIcon />
                </div>
                <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">${hit.value}</div>
                </div>
            </div>
            <Breadcrumb
                items={hit.categories.slice(0, -1).map((_, index) => (
                    <components.Highlight
                        key={index}
                        hit={hit}
                        attribute={['categories', `${index}`]}
                    />
                ))}
            />
        </div>
    )
}
