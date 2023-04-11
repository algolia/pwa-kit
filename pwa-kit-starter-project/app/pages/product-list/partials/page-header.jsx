/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import PropTypes from 'prop-types'

import {useIntl} from 'react-intl'

// Components
import {Box, Heading, Flex, Text, Fade} from '@chakra-ui/react'

// Project Components
import {useHits, Breadcrumb} from 'react-instantsearch-hooks-web'

const PageHeader = ({categoryId, isLoading, searchQuery, ...otherProps}) => {
    const {results} = useHits()
    const intl = useIntl()
    const title = (categoryId || searchQuery || '').trim()

    return (
        <Box {...otherProps} data-testid="sf-product-list-breadcrumb">
            {/* Breadcrumb */}
            <Breadcrumb
                attributes={[
                    '__primary_category.0',
                    '__primary_category.1',
                    '__primary_category.2'
                ]}
            />
            {searchQuery && <Text>Search Results</Text>}
            {/* Category Title */}
            <Flex>
                {title != '' && (
                    <Heading as="h2" size="lg" marginRight={2}>
                        {title}
                    </Heading>
                )}
                <Heading as="h2" size="lg" marginRight={2}>
                    {!isLoading && <Fade in={true}>({intl.formatNumber(results.nbHits)})</Fade>}
                </Heading>
            </Flex>
        </Box>
    )
}

PageHeader.propTypes = {
    categoryId: PropTypes.string,
    isLoading: PropTypes.bool,
    searchQuery: PropTypes.string
}

export default PageHeader
