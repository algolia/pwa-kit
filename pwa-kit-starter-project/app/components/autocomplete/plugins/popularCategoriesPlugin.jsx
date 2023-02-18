/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/** @jsx h */
/* eslint-disable react/prop-types */
import {getAlgoliaFacets} from '@algolia/autocomplete-js'
import {h} from 'preact'

import {ALGOLIA_PRODUCTS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'

const baseUrl = 'https://res.cloudinary.com/hilnmyskv/image/upload/v1646067858'
const images = {
    Women: `${baseUrl}/women_category_vwzkln.jpg`,
    Bags: `${baseUrl}/bags_category_qd7ssj.jpg`,
    Clothing: `${baseUrl}/clothing_category_xhiz1s.jpg`,
    Men: `${baseUrl}/men_category_wfcley.jpg`,
    'T-shirts': `${baseUrl}/t-shirts_category_gzqcvd.jpg`,
    Shoes: `${baseUrl}/shoes_category_u4fi0q.jpg`
}

export const popularCategoriesPlugin = {
    getSources() {
        return [
            {
                sourceId: 'popularCategoriesPlugin',
                getItems() {
                    return getAlgoliaFacets({
                        searchClient,
                        queries: [
                            {
                                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                                facet: 'categories',
                                params: {
                                    facetQuery: '',
                                    maxFacetHits: 6
                                }
                            }
                        ]
                    })
                },
                getItemInputValue({item}) {
                    return item.label
                },
                onSelect({setIsOpen}) {
                    setIsOpen(true)
                },
                templates: {
                    header({Fragment}) {
                        return (
                            <Fragment>
                                <span className="aa-SourceHeaderTitle">Popular categories</span>
                                <div className="aa-SourceHeaderLine" />
                            </Fragment>
                        )
                    },
                    item({item, components}) {
                        return <CategoryItem hit={item} components={components} />
                    }
                }
            }
        ]
    }
}

function CategoryItem({hit}) {
    return (
        <div className="aa-ItemWrapper aa-PopularCategoryItem">
            <div className="aa-ItemContent">
                <div className="aa-ItemPicture">
                    <img src={images[hit.label]} alt={hit.label} />
                </div>
                <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                        {hit.label} <span>({hit.count})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
