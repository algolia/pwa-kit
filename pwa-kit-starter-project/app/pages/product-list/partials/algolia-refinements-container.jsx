/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, Text} from '@chakra-ui/react'
import PropTypes from 'prop-types'

const AlgoliaRefinementsContainer = (props) => {
    return (
        <Box>
            <Text fontSize="md" fontWeight={600}>
                {props.title}
            </Text>
            <Box mt="4">{props.children}</Box>
        </Box>
    )
}

export default AlgoliaRefinementsContainer

AlgoliaRefinementsContainer.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
}
