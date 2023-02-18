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

import {ALGOLIA_PRODUCTS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'
import {cx, intersperse} from '../utils'

export const quickAccessPlugin = {
    getSources({query}) {
        if (query) {
            return []
        }

        return [
            {
                sourceId: 'quickAccessPlugin',
                getItems() {
                    return getAlgoliaResults({
                        searchClient,
                        queries: [
                            {
                                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                                query,
                                params: {
                                    hitsPerPage: 0,
                                    ruleContexts: ['quickAccess']
                                }
                            }
                        ],
                        transformResponse({results}) {
                            return results?.[0].userData?.[0]?.items || []
                        }
                    })
                },
                templates: {
                    header({Fragment}) {
                        return (
                            <Fragment>
                                <span className="aa-SourceHeaderTitle">Quick access</span>
                                <div className="aa-SourceHeaderLine" />
                            </Fragment>
                        )
                    },
                    item({item}) {
                        return <QuickAccessItem hit={item} />
                    }
                }
            }
        ]
    }
}

function QuickAccessItem({hit}) {
    return (
        <a
            href={hit.href}
            className={cx('aa-ItemLink aa-QuickAccessItem', `aa-QuickAccessItem--${hit.template}`)}
        >
            <div className="aa-ItemContent">
                {hit.image && (
                    <div className="aa-ItemPicture">
                        <img src={hit.image} alt={hit.title} />
                    </div>
                )}

                <div className="aa-ItemContentBody">
                    {hit.date && <div className="aa-ItemContentDate">{hit.date}</div>}
                    <div className="aa-ItemContentTitle">
                        {intersperse(hit.title.split('\n'), <br />)}
                    </div>
                    {hit.subtitle && (
                        <div className="aa-ItemContentSubTitle">
                            {intersperse(hit.subtitle.split('\n'), <br />)}
                        </div>
                    )}

                    {hit.links && (
                        <ul>
                            {hit.links.map((link) => (
                                <li key={link.text}>
                                    <a href={link.href}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </a>
    )
}
