/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {HierarchicalMenu} from 'react-instantsearch-hooks-web'
import PropTypes from 'prop-types'

const AlgoliaHierarchicalRefinements = (props) => {
    const {attributes, rootPath} = props
    return <HierarchicalMenu attributes={attributes} rootPath={rootPath} />
}

AlgoliaHierarchicalRefinements.propTypes = {
    attributes: PropTypes.array,
    rootPath: PropTypes.object
}

export default AlgoliaHierarchicalRefinements
