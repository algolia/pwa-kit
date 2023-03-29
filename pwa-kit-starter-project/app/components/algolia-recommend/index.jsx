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
import {SimpleGrid} from '@chakra-ui/react'

function RelatedItem({item}) {
    console.log('item', item)
    const productSearchItem = item
    const {currency} = useCurrency()

    return (
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
    )
}

function DefaultRender({props}) {
    return (
        <section className="auc-Recommend">
            <div>something like that</div>

            <props.View />
        </section>
    )
}

function AlgoliaFrequentlyBoughtTogether(props) {
    // const styles = useMultiStyleConfig('AlgoliaRecommend')

    const recommendClient = recommend('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')
    const indexName = 'zzsb_032_dx__NTOManaged__products__default'
    const currentObjectID = props.objectId

    return (
        <SimpleGrid columns={2} spacingX={4} spacingY={{base: 12, lg: 16}}>
            <FrequentlyBoughtTogether
                recommendClient={recommendClient}
                indexName={indexName}
                objectIDs={[currentObjectID]}
                itemComponent={RelatedItem}
            ></FrequentlyBoughtTogether>
        </SimpleGrid>
    )
}

AlgoliaFrequentlyBoughtTogether.propTypes = {
    objectId: PropTypes.string
}

export default AlgoliaFrequentlyBoughtTogether
