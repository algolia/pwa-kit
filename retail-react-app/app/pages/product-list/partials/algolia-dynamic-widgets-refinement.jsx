/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {DynamicWidgets} from 'react-instantsearch'
import AlgoliaColorRefinements from './algolia-color-refinements'
import AlgoliaSizeRefinements from './algolia-size-refinements'
import AlgoliaRangeRefinements from './algolia-range-refinements'
import AlgoliaHierarchicalRefinements from './algolia-hierarchical-refinements'
import AlgoliaCheckboxRefinements from './algolia-checkbox-refinements'
import AlgoliaButtonRefinements from './algolia-button-refinements'


const AlgoliaDynamicWidgetsRefinement = (props) => {
    const hierarchicalCategoryAttributes = [
        `__primary_category.0`,
        `__primary_category.1`,
        `__primary_category.2`
    ]

    return (
            <DynamicWidgets fallbackComponent={AlgoliaButtonRefinements}>
                <AlgoliaHierarchicalRefinements
                    attributes={hierarchicalCategoryAttributes}
                    title="Category"
                />
                <AlgoliaColorRefinements attribute="refinementColor" title="Color" />
                <AlgoliaSizeRefinements attribute="size" title="Size" />
                <AlgoliaRangeRefinements attribute="price.USD" title="Price" />
                <AlgoliaButtonRefinements attribute="item_department" />
            </DynamicWidgets>
    )
}

AlgoliaDynamicWidgetsRefinement.propTypes = {
    attribute: PropTypes.string,
    title: PropTypes.string
}

export default AlgoliaDynamicWidgetsRefinement
