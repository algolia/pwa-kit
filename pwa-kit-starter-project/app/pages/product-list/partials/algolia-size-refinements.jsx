/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {SimpleGrid, Button, Center, useMultiStyleConfig} from '@chakra-ui/react'
import {useRefinementList} from 'react-instantsearch-hooks-web'
import PropTypes from 'prop-types'

const AlgoliaSizeRefinements = (props) => {
    const styles = useMultiStyleConfig('SwatchGroup', {
        variant: 'square',
        disabled: false
    })

    const {items, refine} = useRefinementList(props)

    return (
        <SimpleGrid templateColumns="repeat(auto-fit, 50px)" spacing={4} mt={1}>
            {items.map((item, idx) => {
                return (
                    <Button
                        key={idx}
                        {...styles.swatch}
                        borderColor={item.isRefined ? 'black' : 'gray.100'}
                        backgroundColor={item.isRefined ? 'black' : 'white'}
                        color={item.isRefined ? 'white' : 'gray.900'}
                        onClick={() => refine(item.value)}
                        aria-checked={item.isRefined}
                        variant="outline"
                        marginBottom={0}
                        fontSize="sm"
                        marginRight={0}
                        p="1"
                        _hover={{
                            borderColor: 'gray.200'
                        }}
                    >
                        <Center isTruncated {...styles.swatchButton}>
                            {item.label}
                        </Center>
                    </Button>
                )
            })}
        </SimpleGrid>
    )
}

AlgoliaSizeRefinements.propTypes = {
    attribute: PropTypes.string,
    items: PropTypes.array
}

export default AlgoliaSizeRefinements
