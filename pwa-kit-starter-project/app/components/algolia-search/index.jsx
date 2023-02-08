/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box} from '@chakra-ui/react'
import {Autocomplete} from '../autocomplete'

/**
 * The SearchInput component is a stylized
 * text input made specifically for use in
 * the application header.
 * @param  {object} props
 * @param  {object} ref reference to the input element
 * @return  {React.ReactElement} - SearchInput component
 */
const AlgoliaSearch = (props) => {
    return (
        <Box>
            <Autocomplete placeholder="Search" openOnFocus />
        </Box>
    )
}

AlgoliaSearch.displayName = 'SearchInput'

export default AlgoliaSearch
