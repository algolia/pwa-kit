/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export default {
    baseStyle: {
        '.label': {
            display: 'none'
        },
        '.item': {
            gap: 2,
            color: 'black',
            borderColor: 'transparent',
            backgroundColor: 'gray.100',
            textTransform: 'capitalize',
            height: 8,
            padding: 5,
            fontWeight: 600
        },
        '.category': {
            display: 'flex',
            justifyContent: 'center',
            marginLeft: 0,
            alignItems: 'center'
        },
        '.delete': {
            color: 'black',
            fontWeight: 600,
            marginLeft: 2
        }
    }
}
