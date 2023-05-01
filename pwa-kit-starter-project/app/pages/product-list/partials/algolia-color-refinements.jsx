/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Box, SimpleGrid, HStack, Text, Button, Center, useMultiStyleConfig} from '@chakra-ui/react'
import {useIntl} from 'react-intl'
import PropTypes from 'prop-types'
import {cssColorGroups} from '../../../constants'
import {capitalize} from '../../../utils/utils'
import {useRefinementList} from 'react-instantsearch-hooks-web'
import AlgoliaRefinementsContainer from './algolia-refinements-container'

const AlgoliaColorRefinements = (props) => {
    const intl = useIntl()
    const styles = useMultiStyleConfig('SwatchGroup', {
        variant: 'circle',
        disabled: false
    })

    const {items, refine} = useRefinementList(props)

    return (
        <AlgoliaRefinementsContainer title={props.title} attributes={[props.attribute]}>
            <SimpleGrid columns={2} spacing={2} mt={1}>
                {items.map((item, idx) => {
                    const lcLabel = item.label.toLowerCase()
                    const isMultiColor = lcLabel === 'miscellaneous' || lcLabel === 'multi'
                    return (
                        <Box key={idx}>
                            <HStack onClick={() => refine(item.label)} spacing={1} cursor="pointer">
                                <Button
                                    {...styles.swatch}
                                    color={item.isRefined ? 'black' : 'gray.200'}
                                    border={item.isRefined ? '1px' : '0'}
                                    aria-checked={item.isRefined}
                                    variant="outline"
                                    marginRight={0}
                                    marginBottom="-1px"
                                >
                                    <Center
                                        {...styles.swatchButton}
                                        marginRight={0}
                                        border={lcLabel === 'white' && '1px solid black'}
                                    >
                                        <Box
                                            marginRight={0}
                                            height="100%"
                                            width="100%"
                                            minWidth="32px"
                                            backgroundRepeat="no-repeat"
                                            backgroundSize="cover"
                                            backgroundColor={cssColorGroups[lcLabel]}
                                            background={isMultiColor && cssColorGroups[lcLabel]}
                                        />
                                    </Center>
                                </Button>
                                <Text
                                    display="flex"
                                    alignItems="center"
                                    fontSize="sm"
                                    isTruncated
                                    marginBottom="1px"
                                    fontWeight={item.isRefined ? 'bold' : 'normal'}
                                >{`${capitalize(item.label)} (${intl.formatNumber(
                                    item.count
                                )})`}</Text>
                            </HStack>
                        </Box>
                    )
                })}
            </SimpleGrid>
        </AlgoliaRefinementsContainer>
    )
}

AlgoliaColorRefinements.propTypes = {
    attribute: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string
}

export default AlgoliaColorRefinements
