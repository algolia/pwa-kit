/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export default {
    baseStyle: {
        '.aa-PanelSections': {
            display: 'flex',
            gap: 2
        },
        '.aa-PanelSection--left': {
            width: '30%'
        },
        '.aa-PanelSection--right': {
            width: '70%'
        },
        '.aa-Products': {
            '.aa-List': {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)'
            },
            '.aa-Item': {
                padding: 2
            },
            '.aa-ItemLink': {
                justifyContent: 'stretch',
                height: '100%'
            },
            '.aa-ItemContent': {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            },
            '.aa-ItemPicture': {
                width: '100%',
                height: '100%',
                borderRadius: 1,
                overflow: 'hidden'
            },
            '.aa-ItemPicture img': {
                objectFit: 'cover',
                width: '100%',
                height: 'auto'
            },
            '.aa-ItemContentBody': {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2
            },
            '.aa-ItemContentBrand': {
                fontSize: 'small',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            },
            '.aa-ItemContentTitle': {
                fontSize: 'small',
                margin: 0,
                '-webkit-box-orient': 'vertical',
                '-webkit-line-clamp': 2,
                whiteSpace: 'normal'
            },
            '.aa-ItemContentPrice': {
                display: 'flex',
                columnGap: 2
            },
            '.aa-ItemContentPriceCurrent': {
                fontWeight: 'bold'
            }
        }
    }
}
