/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import {DEFAULT_SITE_TITLE} from '../../constants'

const Seo = ({title, description, noIndex, children, ...props}) => {
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_TITLE}` : DEFAULT_SITE_TITLE

    return (
        <Helmet {...props}>
            <title>{fullTitle} And then some??</title>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.0.0/themes/reset-min.css"
            />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.0.0/themes/satellite-min.css"
            />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic"
            />
            {description && <meta name="description" content={description} />}
            {noIndex && <meta name="robots" content="noindex" />}
            {children}
        </Helmet>
    )
}

Seo.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    noIndex: PropTypes.bool,
    children: PropTypes.node
}

export default Seo
