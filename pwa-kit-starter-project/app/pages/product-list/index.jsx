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
import {
    InstantSearch,
    Pagination,
    RefinementList,
    HierarchicalMenu,
    useHits
} from 'react-instantsearch-hooks-web'

import {NumericMenu} from '../../components/numeric-menu'

// Components
import {
    Box,
    Flex,
    SimpleGrid,
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
    DrawerCloseButton
} from '@chakra-ui/react'

// Project Components
// import Pagination from '../../components/pagination'
import ProductTile, {Skeleton as ProductTileSkeleton} from '../../components/algolia-product-tile'
import {HideOnDesktop} from '../../components/responsive'
import Refinements from './partials/refinements'
import SelectedRefinements from './partials/selected-refinements'
import EmptySearchResults from './partials/empty-results'
import PageHeader from './partials/page-header'

// Icons
import {FilterIcon, ChevronDownIcon} from '../../components/icons'

// Hooks
import {useLimitUrls, usePageUrls, useSortUrls, useSearchParams} from '../../hooks'
import {useToast} from '../../hooks/use-toast'
import useWishlist from '../../hooks/use-wishlist'
import {parse as parseSearchParams} from '../../hooks/use-search-params'
import useEinstein from '../../commerce-api/hooks/useEinstein'

// Others
import {HTTPNotFound} from 'pwa-kit-react-sdk/ssr/universal/errors'

// Constants
import {
    DEFAULT_LIMIT_VALUES,
    API_ERROR_MESSAGE,
    MAX_CACHE_AGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '../../constants'
import useNavigation from '../../hooks/use-navigation'
import LoadingSpinner from '../../components/loading-spinner'

// NOTE: You can ignore certain refinements on a template level by updating the below
// list of ignored refinements.
const REFINEMENT_DISALLOW_LIST = ['c_isNew']

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
    const pageUrls = usePageUrls({total})
    const sortUrls = useSortUrls({options: sortingOptions})
    const limitUrls = useLimitUrls()

    // If we are loaded and still have no products, show the no results component.
    const showNoResults = !isLoading && productSearchResult && !productSearchResult?.hits

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

    /**************** Einstein ****************/
    useEffect(() => {
        if (productSearchResult) {
            searchQuery
                ? einstein.sendViewSearch(searchQuery, productSearchResult)
                : einstein.sendViewCategory(category, productSearchResult)
        }
    }, [productSearchResult])

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

    const algoliaInitialQuery = searchQuery
        ? {query: searchParams}
        : {HierarchicalMenu: {categories: ['Womens > Bottoms']}}
    const algoliaInitialState = {zzsb_032_dx__NTOManaged__products__default: algoliaInitialQuery}


    const searchClient = algoliasearch('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')

    function CustomHits(props) {
        const {hits} = useHits(props)

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

    return (
        <Box
            className="sf-product-list-page"
            data-testid="sf-product-list-page"
            layerStyle="page"
            paddingTop={{base: 6, lg: 8}}
            {...rest}
        >
            <Helmet>
                <title>{category?.pageTitle}</title>
                <meta name="description" content={category?.pageDescription} />
                <meta name="keywords" content={category?.pageKeywords} />
            </Helmet>
            <Text>Another Hello World</Text>
            <InstantSearch
                searchClient={searchClient}
                indexName="zzsb_032_dx__NTOManaged__products__default"
                initialUiState={algoliaInitialState}
            >
                <Stack
                    display={{base: 'none', lg: 'flex'}}
                    direction="row"
                    justify="flex-start"
                    align="flex-start"
                    spacing={4}
                    marginBottom={6}
                ></Stack>
                <Grid templateColumns={{base: '1fr', md: '280px 1fr'}} columnGap={6}>
                    <Stack display={{base: 'none', md: 'flex'}}>
                        <Text>Brands</Text>
                        <RefinementList attribute="brand" />
                        <Text>Categories</Text>
                        <HierarchicalMenu
                            attributes={[
                                '__primary_category.0',
                                '__primary_category.1',
                                '__primary_category.2'
                            ]}
                        />
                        <Text>Price</Text>
                        <NumericMenu
                            attribute="price.USD"
                            items={[
                                {label: '<= $10', end: 10},
                                {label: '$10 - $100', start: 10, end: 100},
                                {label: '$100 - $500', start: 100, end: 500},
                                {label: '>= $500', start: 500}
                            ]}
                        />
                    </Stack>
                    <Box>
                        <CustomHits />
                        {/* Footer */}
                        <Flex justifyContent={['center', 'center', 'flex-start']} paddingTop={8}>
                            <Pagination />
                        </Flex>
                    </Box>
                </Grid>
            </InstantSearch>
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
    console.log('params', params)

    // In case somebody navigates to /search without a param
    if (!categoryId && !isSearch) {
        // We will simulate search for empty string
        return {searchQuery: ' ', productSearchResult: {}}
    }

    const searchParams = parseSearchParams(location.search, false)

    if (!searchParams.refine.includes(`cgid=${categoryId}`) && categoryId) {
        searchParams.refine.push(`cgid=${categoryId}`)
    }

    // only search master products
    searchParams.refine.push('htype=master')

    // Set the `cache-control` header values to align with the Commerce API settings.
    if (res) {
        res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    }

    const [category, productSearchResult] = await Promise.all([
        isSearch
            ? Promise.resolve()
            : api.shopperProducts.getCategory({
                  parameters: {id: categoryId, levels: 0}
              }),
        api.shopperSearch.productSearch({
            parameters: searchParams
        })
    ])

    // Apply disallow list to refinements.
    productSearchResult.refinements = productSearchResult?.refinements?.filter(
        ({attributeId}) => !REFINEMENT_DISALLOW_LIST.includes(attributeId)
    )

    // The `isomorphic-sdk` returns error objects when they occur, so we
    // need to check the category type and throw if required.
    if (category?.type?.endsWith('category-not-found')) {
        throw new HTTPNotFound(category.detail)
    }
    console.log(category)

    return {searchQuery: searchQuery, productSearchResult, category}
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
    category: PropTypes.object
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
