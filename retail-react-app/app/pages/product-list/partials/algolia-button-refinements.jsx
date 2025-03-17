/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {SimpleGrid, Button, Center, useMultiStyleConfig} from '@chakra-ui/react'
import {useIntl} from 'react-intl'
import PropTypes from 'prop-types'
import {useRefinementList} from 'react-instantsearch'
import AlgoliaRefinementsContainer from './algolia-refinements-container'

const AlgoliaButtonRefinements = (props) => {
    const intl = useIntl()
    const styles = useMultiStyleConfig('SwatchGroup', {
        variant: 'square',
        disabled: false
    })

    const {items, refine} = useRefinementList(props)

    return (
        <AlgoliaRefinementsContainer title={props.title} attributes={[props.attribute]}>
            <SimpleGrid columns={1} spacing={2} mt={1}>
                {items.map((item, idx) => {
                    const lcLabel = item.label.toLowerCase()
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
        </AlgoliaRefinementsContainer>
    )
}

AlgoliaButtonRefinements.propTypes = {
    attribute: PropTypes.string,
    title: PropTypes.string
}

export default AlgoliaButtonRefinements
