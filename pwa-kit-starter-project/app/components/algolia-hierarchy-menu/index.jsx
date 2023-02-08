/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {Link as RouteLink} from 'react-router-dom'

import {useHierarchicalMenu} from 'react-instantsearch-hooks-web'

// Components
import {
    Box,
    Container,
    SimpleGrid,
    Fade,
    Flex,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Center,
    Spinner,
    Text,

    // Hooks
    useTheme
} from '@chakra-ui/react'
import Link from '../link'
// Others
import {algoliaUrlBuilder} from '../../utils/url'
import {ChevronDownIcon} from '../icons'

function CustomHierarchicalMenu(props) {
    const {items, refine} = useHierarchicalMenu(props)
    const theme = useTheme()
    const {baseStyle} = theme.components.ListMenu

    return (
        <nav id="list-menu" aria-label="main" aria-live="polite" aria-atomic="true">
            <Flex {...baseStyle.container}>
                {items ? (
                    <Stack direction={'row'} spacing={0} {...baseStyle.stackContainer}>
                        {items.map((item) => {
                            const {label, value} = item
                            return (
                                <Box key={value}>
                                    <Link
                                        as={RouteLink}
                                        to={algoliaUrlBuilder(item)}
                                        {...baseStyle.listMenuTriggerLinkIcon}
                                    >
                                        {label}
                                    </Link>
                                </Box>
                            )
                        })}
                    </Stack>
                ) : (
                    <Center p="2">
                        <Spinner opacity="0" size="lg" />
                    </Center>
                )}
            </Flex>
        </nav>
    )
}

CustomHierarchicalMenu.displayName = 'CustomHierarchicalMenu'

export default CustomHierarchicalMenu
