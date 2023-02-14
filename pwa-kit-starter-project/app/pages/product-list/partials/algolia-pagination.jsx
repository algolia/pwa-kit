/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {Link, ListItem, OrderedList} from '@chakra-ui/react'
import React from 'react'
import {usePagination} from 'react-instantsearch-hooks-web'
import {ChevronLeftIcon, ChevronRightIcon} from '../../../components/icons'

const AlgoliaPagination = (props) => {
    const {currentRefinement, pages, refine} = usePagination(props)
    return (
        <OrderedList listStyleType="none" display="flex" flexShrink="0" margin="0">
            <ListItem>
                <Link
                    px="3"
                    py="3"
                    border="1px"
                    borderLeftRadius="2xl"
                    borderColor="gray.100"
                    _hover={{
                        backgroundColor: 'gray.50'
                    }}
                    href="#"
                >
                    <ChevronLeftIcon />
                    Previous
                </Link>
            </ListItem>
            {pages.map((page) => (
                <ListItem key={page}>
                    <Link
                        px="5"
                        py="3"
                        borderTop="1px"
                        borderBottom="1px"
                        color={page == currentRefinement ? 'white' : 'black'}
                        backgroundColor={page == currentRefinement ? 'black' : 'white'}
                        borderColor="gray.100"
                        _hover={{
                            backgroundColor: page == currentRefinement ? 'black' : 'gray.50'
                        }}
                        href="#"
                        onClick={(event) => {
                            event.preventDefault()
                            refine(page)
                        }}
                    >
                        {page === currentRefinement ? <strong>{page}</strong> : page}
                    </Link>
                </ListItem>
            ))}
            <ListItem>
                <Link
                    px="3"
                    py="3"
                    border="1px"
                    borderRightRadius="2xl"
                    borderColor="gray.100"
                    _hover={{
                        backgroundColor: 'gray.50'
                    }}
                    href="#"
                >
                    Next
                    <ChevronRightIcon />
                </Link>
            </ListItem>
        </OrderedList>
    )
}

export default AlgoliaPagination
