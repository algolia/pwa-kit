/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, Button, Text} from '@chakra-ui/react'
import {useClearRefinements} from 'react-instantsearch-hooks'
import PropTypes from 'prop-types'

const AlgoliaClearRefinements = (props) => {
    const {canRefine, refine} = useClearRefinements()

    return (
        <Box>
            <Button isActive={canRefine} size="sm" colorScheme="blue" onClick={refine}>
                <Text>Clear Refinements</Text>
            </Button>
        </Box>
    )
}

AlgoliaClearRefinements.propTypes = {
    attribute: PropTypes.string,
    items: PropTypes.array
}

export default AlgoliaClearRefinements
