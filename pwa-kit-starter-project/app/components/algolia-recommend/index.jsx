/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {FrequentlyBoughtTogether} from '@algolia/recommend-react'
import recommend from '@algolia/recommend'
import PropTypes from 'prop-types'
import ProductTile from '../../components/algolia-product-tile'
import {useCurrency} from '../../hooks'
import {Box} from '@chakra-ui/react'

function RelatedItem({item}) {
    console.log('item', item)
    const productSearchItem = item
    const {currency} = useCurrency()

    return (
        <Box width="200px">
            <ProductTile
                data-testid={`sf-product-tile-${productSearchItem.id}`}
                key={productSearchItem.id}
                product={productSearchItem}
                enableFavourite={true}
                isFavourite={false}
                currency={currency}
                onFavouriteToggle={false}
                dynamicImageProps={{
                    widths: ['50vw', '50vw', '20vw', '20vw', '25vw']
                }}
            />
        </Box>
    )
}

function AlgoliaFrequentlyBoughtTogether(props) {
    // const styles = useMultiStyleConfig('AlgoliaRecommend')

    const recommendClient = recommend('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')
    const indexName = 'zzsb_032_dx__NTOManaged__products__default'
    const currentObjectID = props.objectId

    console.log('in recommend')

    return (
        <FrequentlyBoughtTogether
            recommendClient={recommendClient}
            indexName={indexName}
            objectIDs={[currentObjectID]}
            itemComponent={RelatedItem}
        />
    )
}

AlgoliaFrequentlyBoughtTogether.propTypes = {
    objectId: PropTypes.string
}

export default AlgoliaFrequentlyBoughtTogether
