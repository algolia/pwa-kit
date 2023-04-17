/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {
    Breadcrumb as ChakraBreadcrumb,
    BreadcrumbItem as ChakraBreadcrumbItem,
    BreadcrumbLink as ChakraBreadcrumbLink,
    // Hooks
    useStyleConfig
} from '@chakra-ui/react'

import {useBreadcrumb} from 'react-instantsearch-hooks-web'

const AlgoliaBreadcrumb = (props) => {
    try {
        const {items, refine} = useBreadcrumb(props)
        const styles = useStyleConfig('Breadcrumb')

        return (
            <ChakraBreadcrumb className="sf-breadcrumb" {...styles.container}>
                {items.map((item) => (
                    <ChakraBreadcrumbItem key={item.value} data-testid="sf-crumb-item">
                        <ChakraBreadcrumbLink onclick={refine} {...styles.link}>
                            {item.label}
                        </ChakraBreadcrumbLink>
                    </ChakraBreadcrumbItem>
                ))}
            </ChakraBreadcrumb>
        )
    } catch (e) {
        console.error(e)
        return null
    }
}

export default AlgoliaBreadcrumb
