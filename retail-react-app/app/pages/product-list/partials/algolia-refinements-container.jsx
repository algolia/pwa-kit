/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, Divider, Text} from '@chakra-ui/react'
import {useHits} from 'react-instantsearch-hooks-web'
import {useHasRefinements} from '@salesforce/retail-react-app/app/hooks/use-has-refinements'

import PropTypes from 'prop-types'

const AlgoliaRefinementsContainer = (props) => {
    const divider = props.divider === undefined ? true : divider
    const {results} = useHits()
    const hasRefinements = useHasRefinements(results, props.attributes)

    return (
        <Box display={hasRefinements ? 'block' : 'none'}>
            <Text fontSize="md" fontWeight={600}>
                {props.title}
            </Text>
            <Box mt="4">{props.children}</Box>
            {divider && <Divider mt="6" />}
        </Box>
    )
}

export default AlgoliaRefinementsContainer

AlgoliaRefinementsContainer.propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node,
    divider: PropTypes.bool,
    title: PropTypes.string
}
