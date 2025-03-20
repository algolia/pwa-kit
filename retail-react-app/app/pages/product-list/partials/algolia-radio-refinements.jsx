/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, { useState, useEffect } from 'react'
import {Box, Text, Radio, RadioGroup, Stack} from '@chakra-ui/react'
import {useNumericMenu} from 'react-instantsearch-core'
import PropTypes from 'prop-types'

const AlgoliaRadioRefinements = (props) => {

    
    const {items, refine} = useNumericMenu(props)

    const findValue = () => {
        for ( let i = 0;i < items.length;i++) {
            if ( items[i].isRefined ) {
                return items[i].value;
            }
        }
    }
    const val = findValue();
    const [value, setValue] = useState(val);

    if ( val !== value ) setValue(val);

    const handleChange = (val) => {
        setValue(val);
        refine(val);
    }

    return (
        <Box>
            <RadioGroup onChange={handleChange} value={value}>
                <Stack spacing={1}>
                    {items.map((item) => {
                        const label = `${item.label} - ${item.isRefined}`;
                        return (
                            <Box key={item.value}>
                                <Radio
                                    display="flex"
                                    alignItems="center"
                                    height={{base: '44px', lg: '24px'}}
                                    value={item.value}
                                    fontSize="sm"
                                >
                                    <Text marginLeft={-1} fontSize="sm">
                                        {label}
                                    </Text>
                                </Radio>
                            </Box>
                        )
                    })}
                </Stack>
            </RadioGroup>
        </Box>
    )
}

AlgoliaRadioRefinements.propTypes = {
    attribute: PropTypes.string,
    items: PropTypes.array
}

export default AlgoliaRadioRefinements
