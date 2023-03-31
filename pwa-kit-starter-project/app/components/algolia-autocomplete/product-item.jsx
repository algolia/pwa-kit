/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/prop-types */
import React from 'react'
import {Box, Img, Link, Text} from '@chakra-ui/react'
import {productUrlBuilder} from '../../utils/url'

function formatPrice(value, currency) {
    return value.toLocaleString('en-US', {style: 'currency', currency})
}

export function ProductItem({hit, components}) {
    let imageUrl = ''
    let imageAlt = ''

    // eslint-disable-next-line react/prop-types
    hit.image_groups.forEach((imageGroup) => {
        if (imageGroup.view_type == 'small') {
            imageUrl = imageGroup.images[0].dis_base_link
            imageAlt = imageGroup.images[0].alt
        }
    })

    const productPrice = hit.price ? hit.price.USD : ''

    return (
        <Link className="aa-ItemLink" href={productUrlBuilder({id: hit.id})}>
            <Box className="aa-ItemContent">
                <Box className="aa-ItemPicture">
                    <Img src={imageUrl} alt={imageAlt} />
                </Box>
                <Box className="aa-ItemContentBody">
                    <Box>
                        <Text className="aa-ItemContentBrand">
                            <components.Highlight hit={hit} attribute="brand" />
                        </Text>
                        <Box className="aa-ItemContentTitleWrapper">
                            <Text className="aa-ItemContentTitle">
                                <components.Highlight hit={hit} attribute="name" />
                            </Text>
                        </Box>
                    </Box>
                    <Box className="aa-ItemContentPrice">
                        <Text className="aa-ItemContentPriceCurrent">
                            {formatPrice(productPrice, 'USD')}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Link>
    )
}

export default ProductItem
