/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {useHits, useInstantSearch} from 'react-instantsearch-hooks-web'
import {Skeleton as ProductTileSkeleton} from '../../../components/product-tile'

const AlgoliaHits = (props) => {
    const {hitComponent, isLoading} = props
    const {hits, sendEvent} = useHits(props)
    const {status} = useInstantSearch(props)

    if (isLoading || status === 'loading' || status === 'stalled') {
        return (
            <>
                {new Array(10).fill(0).map((value, index) => (
                    <ProductTileSkeleton key={index} />
                ))}
            </>
        )
    }

    return (
        <>
            {hits.map((hit, idx) => (
                <Fragment key={idx}>{hitComponent({hit, sendEvent})}</Fragment>
            ))}
        </>
    )
}

AlgoliaHits.propTypes = {
    hitComponent: PropTypes.func,
    isLoading: PropTypes.bool
}

export default AlgoliaHits
