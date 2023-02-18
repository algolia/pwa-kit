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
import {useState} from 'preact/hooks'

import {Blurhash, StarIcon, FavoriteIcon} from '../components'
import {ALGOLIA_PRODUCTS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'
import {cx} from '../utils'

export const productsPlugin = {
    getSources({query}) {
        if (!query) {
            return []
        }

        return [
            {
                sourceId: 'productsPlugin',
                getItems({setContext}) {
                    return getAlgoliaResults({
                        searchClient,
                        queries: [
                            {
                                indexName: ALGOLIA_PRODUCTS_INDEX_NAME,
                                query,
                                params: {
                                    hitsPerPage: 4
                                }
                            }
                        ],
                        transformResponse({hits, results}) {
                            setContext({
                                nbProducts: results[0].nbHits
                            })

                            return hits
                        }
                    })
                },
                onSelect({setIsOpen}) {
                    setIsOpen(true)
                },
                templates: {
                    header({state, Fragment}) {
                        console.log('state', state)
                        return (
                            <Fragment>
                                <div className="aa-SourceHeaderTitle">
                                    Products for {state.query}
                                </div>
                                <div className="aa-SourceHeaderLine" />
                            </Fragment>
                        )
                    },
                    item({item, components}) {
                        return <ProductItem hit={item} components={components} />
                    },
                    footer({state}) {
                        return (
                            state.context.nbProducts > 4 && (
                                <div style={{textAlign: 'center'}}>
                                    <a
                                        href="https://example.org/"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="aa-SeeAllBtn"
                                    >
                                        See All Products ({state.context.nbProducts})
                                    </a>
                                </div>
                            )
                        )
                    }
                }
            }
        ]
    }
}

function formatPrice(value, currency) {
    return value.toLocaleString('en-US', {style: 'currency', currency})
}

function ProductItem({hit, components}) {
    const [loaded, setLoaded] = useState(false)
    const [favorite, setFavorite] = useState(false)
    let imageUrl = ''
    let imageAlt = ''
    // eslint-disable-next-line react/prop-types
    hit.image_groups.forEach((imageGroup) => {
        if (imageGroup.view_type == 'large') {
            imageUrl = imageGroup.images[0].dis_base_link
            imageAlt = imageGroup.images[0].alt
        }
    })

    const productPrice = hit.price ? hit.price.USD : ''

    return (
        <a
            href="https://example.org/"
            target="_blank"
            rel="noreferrer noopener"
            className="aa-ItemLink aa-ProductItem"
        >
            <div className="aa-ItemContent">
                <div className={cx('aa-ItemPicture', loaded && 'aa-ItemPicture--loaded')}>
                    <div className="aa-ItemPicture--blurred">
                        <Blurhash hash={hit.image_blurred} width={32} height={32} punch={1} />
                    </div>
                    <img src={imageUrl} alt={imageAlt} onLoad={() => setLoaded(true)} />
                </div>

                <div className="aa-ItemContentBody">
                    <div>
                        {hit.brand && (
                            <div className="aa-ItemContentBrand">
                                <components.Highlight hit={hit} attribute="brand" />
                            </div>
                        )}
                        <div className="aa-ItemContentTitleWrapper">
                            <div className="aa-ItemContentTitle">
                                <components.Highlight hit={hit} attribute="name" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="aa-ItemContentPrice">
                            <div className="aa-ItemContentPriceCurrent">
                                {formatPrice(productPrice, 'USD')}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="aa-ItemFavorite"
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setFavorite((currentFavorite) => !currentFavorite)
                    }}
                >
                    <div className="aa-ItemIcon aa-ItemIcon--noBorder aa-FavoriteIcon">
                        <FavoriteIcon className={cx(!favorite && 'aa-FavoriteIcon--outlined')} />
                    </div>
                </button>
            </div>
        </a>
    )
}
