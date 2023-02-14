/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export default {
    baseStyle: () => ({
        container: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px',
            borderColor: 'gray.100',
            borderRadius: 'md',
            _hover: {
                textDecoration: 'none',
                border: '1px',
                borderColor: 'gray.200'
            }
        },
        favIcon: {
            position: 'absolute',
            variant: 'unstyled',
            top: 2,
            right: 2
        },
        imageWrapper: {
            position: 'relative',
            marginBottom: 2,
            borderBottom: '1px',
            borderBottomColor: 'gray.100'
        },
        image: {
            position: 'relative',
            ratio: 1
        },
        detailsWrapper: {
            flex: '1 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 3,
            paddingTop: 0,
            fontWeight: 600
        },
        title: {},
        price: {
            marginTop: 3,
            fontSize: '2xl'
        },
        rating: {},
        variations: {}
    }),
    parts: [
        'container',
        'imageWrapper',
        'image',
        'detailsWrapper',
        'price',
        'title',
        'rating',
        'variations'
    ]
}
