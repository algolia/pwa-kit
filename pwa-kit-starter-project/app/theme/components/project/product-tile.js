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
            border: '1px solid #f5f5f5',
            borderRadius: '4px',
            _hover: {
                textDecoration: 'none',
                borderColor: '#ccc'
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
            borderBottom: '1px solid #f5f5f5'
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
            padding: '0 1rem 1rem 1rem',
            fontWeight: 600
        },
        title: {},
        price: {
            marginTop: '1rem',
            fontSize: '1.55rem'
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
