/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, useMultiStyleConfig} from '@chakra-ui/react'
import {HierarchicalMenu} from 'react-instantsearch-hooks-web'
import PropTypes from 'prop-types'

const AlgoliaHierarchicalRefinements = (props) => {
    const {attributes, rootPath} = props
    const styles = useMultiStyleConfig('AlgoliaHierarchicalRefinements')

    return (
        <Box sx={styles}>
            <HierarchicalMenu
                attributes={attributes}
                rootPath={rootPath}
                classNames={{
                    root: 'root',
                    count: 'count'
                }}
            />
        </Box>
    )
}

AlgoliaHierarchicalRefinements.propTypes = {
    attributes: PropTypes.array,
    rootPath: PropTypes.string
}

export default AlgoliaHierarchicalRefinements
