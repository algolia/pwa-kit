/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import {RefinementList} from 'react-instantsearch'
import AlgoliaRefinementsContainer from './algolia-refinements-container'

const AlgoliaCheckboxRefinements = (props) => {

    return (
        <AlgoliaRefinementsContainer title={props.title} attributes={[props.attribute]}>
            <Box>
                <RefinementList attribute={props.attribute} />
            </Box>
        </AlgoliaRefinementsContainer>
    )
}

AlgoliaCheckboxRefinements.propTypes = {
    attribute: PropTypes.string,
    title: PropTypes.string
}

export default AlgoliaCheckboxRefinements
