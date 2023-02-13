/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useState, useEffect} from 'react'
import {Link as RouteLink} from 'react-router-dom'

import algoliasearch from 'algoliasearch/lite'

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
import {categoryUrlBuilder} from '../../utils/url'


const getCategories = async (index) => {
    let categories = await index.search('')
    return categories
}

function CustomHierarchicalMenu(props) {
    const [categories, setCategories] = useState([])

    useEffect(async () => {
        async function fetchCategories() {
            try {
                const categoryIndex = 'zzsb_032_dx__NTOManaged__categories__default'
                const searchClient = algoliasearch('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')
                const index = searchClient.initIndex(categoryIndex)
                const content = await getCategories(index)
                const rootCategories = []
                content.hits.forEach((category) => {
                    if (!category.parent_category_id) {
                        rootCategories.push(category)
                    }
                })
                return rootCategories
            } catch (err) {
                console.log(err)
            }
        }
        const categories = await fetchCategories()
        setCategories(categories)
    }, [])

    console.log('categories', categories)

    const theme = useTheme()
    const {baseStyle} = theme.components.ListMenu

    return (
        <nav id="list-menu" aria-label="main" aria-live="polite" aria-atomic="true">
            <Flex {...baseStyle.container}>
                {categories ? (
                    <Stack direction={'row'} spacing={0} {...baseStyle.stackContainer}>
                        {categories.map((item) => {
                            const {id, name} = item
                            return (
                                <Box key={id}>
                                    <Link
                                        as={RouteLink}
                                        to={algoliaUrlBuilder(item)}
                                        {...baseStyle.listMenuTriggerLinkIcon}
                                    >
                                        {name}
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
