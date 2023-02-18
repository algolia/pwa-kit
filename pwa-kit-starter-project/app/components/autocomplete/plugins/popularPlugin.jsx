/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/** @jsx h */
/* eslint-disable react/prop-types */
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import {h} from 'preact'

import {SearchIcon} from '../components'
import {ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'

export const popularPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME,
    getSearchParams() {
        return {
            query: '',
            hitsPerPage: 6
        }
    },
    transformSource({source}) {
        return {
            ...source,
            sourceId: 'popularPlugin',
            getItemInputValue({item}) {
                return item.query
            },
            onSelect({setIsOpen}) {
                setIsOpen(true)
            },
            templates: {
                header({Fragment}) {
                    return (
                        <Fragment>
                            <span className="aa-SourceHeaderTitle">Popular searches</span>
                            <div className="aa-SourceHeaderLine" />
                        </Fragment>
                    )
                },
                item({item}) {
                    return <PopularItem hit={item} />
                }
            }
        }
    }
})

function PopularItem({hit}) {
    return (
        <div className="aa-ItemWrapper">
            <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                <SearchIcon />
            </div>
            <div className="aa-ItemContent">
                <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">{hit.query}</div>
                </div>
            </div>
        </div>
    )
}
