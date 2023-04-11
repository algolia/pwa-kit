/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useHistory, useParams} from 'react-router-dom'
import {FormattedMessage, useIntl} from 'react-intl'
import {Helmet} from 'react-helmet'

import algoliasearch from 'algoliasearch/lite'
import {useHits, Index, Configure, Breadcrumb} from 'react-instantsearch-hooks-web'
import {algoliaRouting} from '../../utils/algolia-routing'

import AlgoliaCurrentRefinements from './partials/algolia-current-refinements'
import AlgoliaRefinementsContainer from './partials/algolia-refinements-container'
import AlgoliaHierarchicalRefinements from './partials/algolia-hierarchical-refinements'
import AlgoliaColorRefinements from './partials/algolia-color-refinements'
import AlgoliaSizeRefinements from './partials/algolia-size-refinements'
import AlgoliaRangeRefinements from './partials/algolia-range-refinements'
import AlgoliaPagination from './partials/algolia-pagination'
import AlgoliaSortBy from './partials/algolia-sort-by'
import AlgoliaClearRefinements from './partials/algolia-clear-refinements'

// Components
import {
    Box,
    Flex,
    SimpleGrid,
    Image,
    Link,
    Grid,
    Select,
    Text,
    FormControl,
    Stack,
    useDisclosure,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalCloseButton,
    ModalOverlay,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Divider,
    Center,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from '@chakra-ui/react'

// Project Components
// import Pagination from '../../components/pagination'
import ProductTile, {Skeleton as ProductTileSkeleton} from '../../components/algolia-product-tile'
import Refinements from './partials/refinements'
import PageHeader from './partials/page-header'

// Hooks
import {useSortUrls, useSearchParams, useCurrency} from '../../hooks'
import {useToast} from '../../hooks/use-toast'
import useWishlist from '../../hooks/use-wishlist'
import useEinstein from '../../commerce-api/hooks/useEinstein'

// Constants
import {
    API_ERROR_MESSAGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '../../constants'
import useNavigation from '../../hooks/use-navigation'
import LoadingSpinner from '../../components/loading-spinner'

const transformCurrentRefinements = (items) => {
    return items.map((item) => {
        let label = item.label

        if (label === 'refinementColor') {
            label = 'Color'
        } else if (label.startsWith('price')) {
            label = 'Price'
        }

        return {
            ...item,
            label
        }
    })
}

/*
 * This is a simple product listing page. It displays a paginated list
 * of product hit objects. Allowing for sorting and filtering based on the
 * allowable filters and sort refinements.
 */
const ProductList = (props) => {
    const {
        searchQuery,
        productSearchResult,
        category,
        catId,
        // eslint-disable-next-line react/prop-types
        staticContext,
        location,
        isLoading,
        ...rest
    } = props
    const {total, sortingOptions} = productSearchResult || {}
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [sortOpen, setSortOpen] = useState(false)
    const {formatMessage} = useIntl()
    const navigate = useNavigation()
    const history = useHistory()
    const params = useParams()
    const toast = useToast()
    const einstein = useEinstein()

    const basePath = `${location.pathname}${location.search}`
    // Reset scroll position when `isLoaded` becomes `true`.
    useEffect(() => {
        isLoading && window.scrollTo(0, 0)
        setFiltersLoading(isLoading)
    }, [isLoading])

    // Get urls to be used for pagination, page size changes, and sorting.
    const sortUrls = useSortUrls({options: sortingOptions})

    /**************** Wishlist ****************/
    const wishlist = useWishlist()
    // keep track of the items has been add/remove to/from wishlist
    const [wishlistLoading, setWishlistLoading] = useState([])
    // TODO: DRY this handler when intl provider is available globally
    const addItemToWishlist = async (product) => {
        try {
            setWishlistLoading([...wishlistLoading, product.productId])
            await wishlist.createListItem({
                id: product.productId,
                quantity: 1
            })
            toast({
                title: formatMessage(TOAST_MESSAGE_ADDED_TO_WISHLIST, {quantity: 1}),
                status: 'success',
                action: (
                    // it would be better if we could use <Button as={Link}>
                    // but unfortunately the Link component is not compatible
                    // with Chakra Toast, since the ToastManager is rendered via portal
                    // and the toast doesn't have access to intl provider, which is a
                    // requirement of the Link component.
                    <Button variant="link" onClick={() => navigate('/account/wishlist')}>
                        {formatMessage(TOAST_ACTION_VIEW_WISHLIST)}
                    </Button>
                )
            })
        } catch {
            toast({
                title: formatMessage(API_ERROR_MESSAGE),
                status: 'error'
            })
        } finally {
            setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
        }
    }

    // TODO: DRY this handler when intl provider is available globally
    const removeItemFromWishlist = async (product) => {
        try {
            setWishlistLoading([...wishlistLoading, product.productId])
            await wishlist.removeListItemByProductId(product.productId)
            toast({
                title: formatMessage(TOAST_MESSAGE_REMOVED_FROM_WISHLIST),
                status: 'success'
            })
        } catch {
            toast({
                title: formatMessage(API_ERROR_MESSAGE),
                status: 'error'
            })
        } finally {
            setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
        }
    }

    // /**************** Einstein ****************/
    // useEffect(() => {
    //     if (productSearchResult) {
    //         searchQuery
    //             ? einstein.sendViewSearch(searchQuery, productSearchResult)
    //             : einstein.sendViewCategory(category, productSearchResult)
    //     }
    // }, [productSearchResult])

    /**************** Filters ****************/
    const [searchParams, {stringify: stringifySearchParams}] = useSearchParams()
    const [filtersLoading, setFiltersLoading] = useState(false)

    // Toggles filter on and off
    const toggleFilter = (value, attributeId, selected, allowMultiple = true) => {
        const searchParamsCopy = {...searchParams}

        // Remove the `offset` search param if present.
        delete searchParamsCopy.offset

        // If we aren't allowing for multiple selections, simply clear any value set for the
        // attribute, and apply a new one if required.
        if (!allowMultiple) {
            delete searchParamsCopy.refine[attributeId]

            if (!selected) {
                searchParamsCopy.refine[attributeId] = value.value
            }
        } else {
            // Get the attibute value as an array.
            let attributeValue = searchParamsCopy.refine[attributeId] || []
            let values = Array.isArray(attributeValue) ? attributeValue : attributeValue.split('|')

            // Either set the value, or filter the value out.
            if (!selected) {
                values.push(value.value)
            } else {
                values = values?.filter((v) => v !== value.value)
            }

            // Update the attribute value in the new search params.
            searchParamsCopy.refine[attributeId] = values

            // If the update value is an empty array, remove the current attribute key.
            if (searchParamsCopy.refine[attributeId].length === 0) {
                delete searchParamsCopy.refine[attributeId]
            }
        }

        if (!searchQuery) {
            navigate(`/category/${params.categoryId}?${stringifySearchParams(searchParamsCopy)}`)
        } else {
            navigate(`/search?${stringifySearchParams(searchParamsCopy)}`)
        }
    }

    // Clears all filters
    const resetFilters = () => {
        navigate(window.location.pathname)
    }

    let selectedSortingOptionLabel = productSearchResult?.sortingOptions?.find(
        (option) => option.id === productSearchResult?.selectedSortingOption
    )

    // API does not always return a selected sorting order
    if (!selectedSortingOptionLabel) {
        selectedSortingOptionLabel = productSearchResult?.sortingOptions?.[0]
    }

    // let catJson = {}
    let hierarchicalRootMenu = ''
    let filters = ''
    let query = ''

    const searchIndex = 'zzsb_032_dx__NTOManaged__products__default'
    const articleIndex = 'sfcc_articles'
    let categoryTitle = ''
    let titleSections = catId ? catId.split('-') : []
    let categorySections = []
    titleSections.forEach((section) => {
        if (section == 'shoes') section = 'Footwear'
        if (catId == 'men-jackets' && section == 'jackets') {
            section = 'Jackets & Vests'
        }
        categorySections.push(section.charAt(0).toUpperCase() + section.slice(1))
    })
    categoryTitle = categorySections.join(' > ')

    if (catId && !searchQuery) {
        // build catJson
        filters = `'__primary_category.${categorySections.length - 1}':"${categoryTitle}"`
        console.log(`filters: ${filters}`)
    } else if (searchQuery) {
        query = `${searchParams.q}`
    }

    function CustomHits(props) {
        const {hits} = useHits(props)
        const {currency} = useCurrency()

        return (
            <>
                <SimpleGrid columns={[2, 2, 3, 3]} spacingX={4} spacingY={{base: 12, lg: 16}}>
                    {hits.map((hit) => {
                        const isInWishlist = !!wishlist.findItemByProductId(hit.id)

                        const productSearchItem = hit

                        return (
                            <ProductTile
                                data-testid={`sf-product-tile-${productSearchItem.id}`}
                                key={productSearchItem.id}
                                product={productSearchItem}
                                enableFavourite={true}
                                isFavourite={isInWishlist}
                                currency={currency}
                                onClick={() => {
                                    if (searchQuery) {
                                        einstein.sendClickSearch(searchQuery, productSearchItem)
                                    } else if (category) {
                                        einstein.sendClickCategory(category, productSearchItem)
                                    }
                                }}
                                onFavouriteToggle={(isFavourite) => {
                                    const action = isFavourite
                                        ? addItemToWishlist
                                        : removeItemFromWishlist
                                    return action(productSearchItem)
                                }}
                                dynamicImageProps={{
                                    widths: ['50vw', '50vw', '20vw', '20vw', '25vw']
                                }}
                            />
                        )
                    })}
                </SimpleGrid>
            </>
        )
    }

    function ArticleHits(props) {
        const {hits} = useHits(props)
        const {currency} = useCurrency()

        return (
            <>
                <Box>
                    {hits.map((hit) => {
                        const article = hit

                        return (
                            <Flex
                                key={article.objectID}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                marginTop="5px"
                            >
                                <Center w="150px" bg="green.500">
                                    <Image src={article['Image Link']} />
                                </Center>
                                <Box flex="1" marginLeft="10px">
                                    <Link href={article.Link}>{article.Title}</Link>
                                    <Text>{article.Subtitle}</Text>
                                </Box>
                            </Flex>
                        )
                    })}
                </Box>
            </>
        )
    }

    return (
        <Box
            className="sf-product-list-page"
            data-testid="sf-product-list-page"
            layerStyle="page"
            id="product-list-page"
            paddingTop={{base: 6, lg: 8}}
            {...rest}
        >
            <Helmet>
                <title>{category?.pageTitle}</title>
                <meta name="description" content={category?.pageDescription} />
                <meta name="keywords" content={category?.pageKeywords} />
            </Helmet>
            <Configure filters={filters} query={query} />
            <Stack
                display={{base: 'none', lg: 'flex'}}
                direction="row"
                justify="flex-start"
                align="flex-start"
                spacing={6}
                marginBottom={6}
            >
                <Flex align="left" width="290px">
                    <PageHeader
                        searchQuery={searchQuery}
                        categoryId={catId}
                        isLoading={isLoading}
                    />
                </Flex>

                <Box flex={1} paddingTop={'45px'}>
                    <AlgoliaCurrentRefinements
                        includedAttributes={['size', 'refinementColor', 'price.USD']}
                        transformItems={transformCurrentRefinements}
                    />
                </Box>
                <Box paddingTop={'45px'}>
                    <AlgoliaSortBy
                        items={[
                            {
                                label: 'Sort By: Best Matches',
                                value: 'zzsb_032_dx__NTOManaged__products__default'
                            },
                            {
                                label: 'Sort By: Price Low to High',
                                value: 'zzsb_032_dx__NTOManaged__products__default_price_asc'
                            },
                            {
                                label: 'Sort By: Price High to Low',
                                value: 'zzsb_032_dx__NTOManaged__products__default_price_desc'
                            }
                        ]}
                    />
                </Box>
            </Stack>
            <Grid templateColumns={{base: '1fr', md: '290px 1fr'}} columnGap={6}>
                <Stack spacing="6" divider={<Divider />} direction="column">
                    <AlgoliaRefinementsContainer title="Category">
                        <AlgoliaClearRefinements />
                        <AlgoliaHierarchicalRefinements
                            attributes={[
                                '__primary_category.0',
                                '__primary_category.1',
                                '__primary_category.2'
                            ]}
                            rootPath={hierarchicalRootMenu}
                        />
                    </AlgoliaRefinementsContainer>
                    <AlgoliaRefinementsContainer title="Color">
                        <AlgoliaColorRefinements attribute="refinementColor" />
                    </AlgoliaRefinementsContainer>
                    <AlgoliaRefinementsContainer title="Size">
                        <AlgoliaSizeRefinements attribute="size" />
                    </AlgoliaRefinementsContainer>
                    <AlgoliaRefinementsContainer title="Price">
                        <AlgoliaRangeRefinements attribute="price.USD" />
                    </AlgoliaRefinementsContainer>
                </Stack>
                <Box>
                    {/* <Box mb={4}>
                        <SearchBox />
                    </Box> */}
                    <Tabs>
                        <TabList>
                            <Tab>Products</Tab>
                            <Tab>Articles</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Index indexName={searchIndex}>
                                    <CustomHits />
                                    <Flex
                                        justifyContent={['center', 'center', 'flex-start']}
                                        marginTop={16}
                                    >
                                        <AlgoliaPagination
                                            onPageChange={() => window.scrollTo(0, 0)}
                                        />
                                    </Flex>
                                </Index>
                            </TabPanel>
                            <TabPanel>
                                <Index indexName={articleIndex}>
                                    <ArticleHits />
                                </Index>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Grid>
            {/* </InstantSearch> */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                motionPreset="slideInBottom"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent top={0} marginTop={0}>
                    <ModalHeader>
                        <Text fontWeight="bold" fontSize="2xl">
                            <FormattedMessage
                                defaultMessage="Filter"
                                id="product_list.modal.title.filter"
                            />
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={4}>
                        {filtersLoading && <LoadingSpinner />}
                        <Refinements
                            toggleFilter={toggleFilter}
                            filters={productSearchResult?.refinements}
                            selectedFilters={productSearchResult?.selectedRefinements}
                        />
                    </ModalBody>

                    <ModalFooter
                        // justify="space-between"
                        display="block"
                        width="full"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        paddingBottom={10}
                    >
                        <Stack>
                            <Button width="full" onClick={onClose}>
                                {formatMessage(
                                    {
                                        id: 'product_list.modal.button.view_items',
                                        defaultMessage: 'View {prroductCount} items'
                                    },
                                    {
                                        prroductCount: productSearchResult?.total
                                    }
                                )}
                            </Button>
                            <Button width="full" variant="outline" onClick={() => resetFilters()}>
                                <FormattedMessage
                                    defaultMessage="Clear Filters"
                                    id="product_list.modal.button.clear_filters"
                                />
                            </Button>
                        </Stack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Drawer
                placement="bottom"
                isOpen={sortOpen}
                onClose={() => setSortOpen(false)}
                size="sm"
                motionPreset="slideInBottom"
                scrollBehavior="inside"
                isFullHeight={false}
                height="50%"
            >
                <DrawerOverlay />
                <DrawerContent marginTop={0}>
                    <DrawerHeader boxShadow="none">
                        <Text fontWeight="bold" fontSize="2xl">
                            <FormattedMessage
                                defaultMessage="Sort By"
                                id="product_list.drawer.title.sort_by"
                            />
                        </Text>
                    </DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        {sortUrls.map((href, idx) => (
                            <Button
                                width="full"
                                onClick={() => {
                                    setSortOpen(false)
                                    history.push(href)
                                }}
                                fontSize={'md'}
                                key={idx}
                                marginTop={0}
                                variant="menu-link"
                            >
                                <Text
                                    as={
                                        selectedSortingOptionLabel?.label ===
                                            productSearchResult?.sortingOptions[idx]?.label && 'u'
                                    }
                                >
                                    {productSearchResult?.sortingOptions[idx]?.label}
                                </Text>
                            </Button>
                        ))}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

ProductList.getTemplateName = () => 'product-list'

ProductList.shouldGetProps = ({previousLocation, location}) =>
    !previousLocation ||
    previousLocation.pathname !== location.pathname ||
    previousLocation.search !== location.search

ProductList.getProps = async ({res, params, location, api}) => {
    const {categoryId} = params
    const urlParams = new URLSearchParams(location.search)
    let searchQuery = urlParams.get('q')
    let isSearch = false

    if (searchQuery) {
        isSearch = true
    }
    console.log('categoryId: ' + categoryId)

    // In case somebody navigates to /search without a param
    // if (!categoryId && !isSearch) {
    //     // We will simulate search for empty string
    //     return {searchQuery: ' ', productSearchResult: {}}
    // }

    // const searchParams = parseSearchParams(location.search, false)

    // if (!searchParams.refine.includes(`cgid=${categoryId}`) && categoryId) {
    //     searchParams.refine.push(`cgid=${categoryId}`)
    // }

    // // only search master products
    // searchParams.refine.push('htype=master')

    // // Set the `cache-control` header values to align with the Commerce API settings.
    // if (res) {
    //     res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    // }

    // const [category, productSearchResult] = await Promise.all([
    //     isSearch
    //         ? Promise.resolve()
    //         : api.shopperProducts.getCategory({
    //               parameters: {id: categoryId, levels: 0}
    //           }),
    //     api.shopperSearch.productSearch({
    //         parameters: searchParams
    //     })
    // ])

    // Apply disallow list to refinements.
    // productSearchResult.refinements = productSearchResult?.refinements?.filter(
    //     ({attributeId}) => !REFINEMENT_DISALLOW_LIST.includes(attributeId)
    // )

    // The `isomorphic-sdk` returns error objects when they occur, so we
    // need to check the category type and throw if required.
    // if (category?.type?.endsWith('category-not-found')) {
    //     throw new HTTPNotFound(category.detail)
    // }

    return {searchQuery: searchQuery, catId: categoryId}
}

ProductList.propTypes = {
    /**
     * The search result object showing all the product hits, that belong
     * in the supplied category.
     */
    productSearchResult: PropTypes.object,
    /*
     * Indicated that `getProps` has been called but has yet to complete.
     *
     * Notes: This prop is internally provided.
     */
    isLoading: PropTypes.bool,
    /*
     * Object that represents the current location, it consists of the `pathname`
     * and `search` values.
     *
     * Notes: This prop is internally provided.
     */
    location: PropTypes.object,
    searchQuery: PropTypes.string,
    onAddToWishlistClick: PropTypes.func,
    onRemoveWishlistClick: PropTypes.func,
    category: PropTypes.object,
    catId: PropTypes.string
}

export default ProductList

const Sort = ({sortUrls, productSearchResult, basePath, ...otherProps}) => {
    const intl = useIntl()
    const history = useHistory()

    return (
        <FormControl data-testid="sf-product-list-sort" id="page_sort" width="auto" {...otherProps}>
            <Select
                value={basePath.replace(/(offset)=(\d+)/i, '$1=0')}
                onChange={({target}) => {
                    history.push(target.value)
                }}
                height={11}
                width="240px"
            >
                {sortUrls.map((href, index) => (
                    <option key={href} value={href}>
                        {intl.formatMessage(
                            {
                                id: 'product_list.select.sort_by',
                                defaultMessage: 'Sort By: {sortOption}'
                            },
                            {
                                sortOption: productSearchResult?.sortingOptions[index]?.label
                            }
                        )}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}
Sort.propTypes = {
    sortUrls: PropTypes.array,
    productSearchResult: PropTypes.object,
    basePath: PropTypes.string
}
