/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage, useIntl} from 'react-intl'
import {Helmet} from 'react-helmet'

// Components
import {
    Box,
    Flex,
    SimpleGrid,
    Grid,
    Text,
    Stack,
    useDisclosure,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalCloseButton,
    ModalOverlay
} from '@chakra-ui/react'

// Project Components
import {HideOnDesktop} from '../../components/responsive'
import EmptySearchResults from './partials/empty-results'
import PageHeader from './partials/page-header'

// Icons
import {FilterIcon} from '../../components/icons'

// Hooks
import {useCurrency} from '../../hooks'
import {useToast} from '../../hooks/use-toast'
import useWishlist from '../../hooks/use-wishlist'
import {parse as parseSearchParams} from '../../hooks/use-search-params'
import useEinstein from '../../commerce-api/hooks/useEinstein'

// Others
import {HTTPNotFound} from 'pwa-kit-react-sdk/ssr/universal/errors'
import {getConfig} from 'pwa-kit-runtime/utils/ssr-config'

// Constants
import {
    API_ERROR_MESSAGE,
    MAX_CACHE_AGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '../../constants'

import useNavigation from '../../hooks/use-navigation'

// Algolia
import algoliasearch from 'algoliasearch/lite'
import {Configure, InstantSearch} from 'react-instantsearch-hooks-web'
import ProductTile from '../../components/algolia-product-tile'
import AlgoliaHits from './partials/algolia-hits'
import AlgoliaCurrentRefinements from './partials/algolia-current-refinements'
import AlgoliaHierarchicalRefinements from './partials/algolia-hierarchical-refinements'
import AlgoliaColorRefinements from './partials/algolia-color-refinements'
import AlgoliaNoResultsBoundary from './partials/algolia-no-results-boundary'
import AlgoliaSizeRefinements from './partials/algolia-size-refinements'
import AlgoliaRangeRefinements from './partials/algolia-range-refinements'
import AlgoliaPagination from './partials/algolia-pagination'
import AlgoliaSortBy from './partials/algolia-sort-by'
import AlgoliaClearRefinements from './partials/algolia-clear-refinements'
import AlgoliaUiStateProvider from './partials/algolia-uistate-provider'

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
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {formatMessage} = useIntl()
    const navigate = useNavigation()
    const toast = useToast()
    const einstein = useEinstein()
    const {currency} = useCurrency()

    let {app: algoliaConfig} = useMemo(() => getConfig(), [])
    algoliaConfig = {
        ...algoliaConfig.algolia
    }

    const allIndices = [algoliaConfig.indices.primary, ...algoliaConfig.indices.replicas]
    const indexName = algoliaConfig.indices.primary.value

    const searchClient = useMemo(() => {
        return algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey)
    }, [])

    const hierarchicalCategoryAttributes = [
        `__primary_category.0`,
        `__primary_category.1`,
        `__primary_category.2`
    ]

    const currentRefinementAttributes = [
        'size',
        'refinementColor',
        'price.USD',
        '__primary_category.0'
    ]

    const filterEls = (
        <>
            <AlgoliaHierarchicalRefinements
                attributes={hierarchicalCategoryAttributes}
                title="Category"
            />
            <AlgoliaColorRefinements attribute="refinementColor" title="Color" />
            <AlgoliaSizeRefinements attribute="size" title="Size" />
            <AlgoliaRangeRefinements attribute="price.USD" title="Price" />
        </>
    )

    const query = searchQuery ?? ''
    const filters = !isLoading && category?.id ? `categories.id:${category.id}` : ''

    // Reset scroll position when `isLoaded` becomes `true`.
    useEffect(() => {
        isLoading && window.scrollTo(0, 0)
    }, [isLoading])

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
            <InstantSearch searchClient={searchClient} indexName={indexName} routing>
                <Configure query={query} filters={filters} />
                <AlgoliaNoResultsBoundary
                    fallback={<EmptySearchResults searchQuery={searchQuery} category={category} />}
                >
                    <>
                        {/* Header */}

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
                                    category={category}
                                    isLoading={isLoading}
                                    searchQuery={searchQuery}
                                />
                            </Flex>
                            <Flex flex={1} paddingTop={'45px'} alignItems="center" gap="3">
                                <AlgoliaCurrentRefinements
                                    includedAttributes={currentRefinementAttributes}
                                />
                                <AlgoliaClearRefinements />
                            </Flex>
                            <Box paddingTop={'45px'}>
                                <AlgoliaSortBy items={allIndices} />
                            </Box>
                        </Stack>

                        <HideOnDesktop>
                            <Stack spacing={6}>
                                <PageHeader
                                    category={category}
                                    isLoading={isLoading}
                                    searchQuery={searchQuery}
                                />
                                <Stack
                                    display={{base: 'flex', md: 'none'}}
                                    direction="row"
                                    justify="flex-start"
                                    align="center"
                                    spacing={1}
                                    height={12}
                                    borderColor="gray.100"
                                >
                                    <Flex align="center">
                                        <Button
                                            fontSize="sm"
                                            colorScheme="black"
                                            variant="outline"
                                            marginRight={2}
                                            display="inline-flex"
                                            leftIcon={<FilterIcon boxSize={5} />}
                                            onClick={onOpen}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Filter"
                                                id="product_list.button.filter"
                                            />
                                        </Button>
                                    </Flex>
                                    <Flex align="center">
                                        <AlgoliaSortBy items={allIndices} />
                                    </Flex>
                                </Stack>
                            </Stack>
                            <Flex
                                flex={1}
                                paddingTop={4}
                                marginBottom={4}
                                alignItems="center"
                                gap="3"
                            >
                                <AlgoliaCurrentRefinements
                                    includedAttributes={currentRefinementAttributes}
                                />
                                <AlgoliaClearRefinements />
                            </Flex>
                        </HideOnDesktop>

                        {/* Body  */}
                        <Grid templateColumns={{base: '1fr', md: '290px 1fr'}} columnGap={6}>
                            <Stack
                                display={{base: 'none', md: 'flex'}}
                                spacing="6"
                                direction="column"
                            >
                                {filterEls}
                            </Stack>
                            <Box>
                                <SimpleGrid
                                    columns={[2, 2, 3, 3]}
                                    spacingX={4}
                                    spacingY={{base: 12, lg: 8}}
                                >
                                    <AlgoliaHits
                                        isLoading={isLoading}
                                        hitComponent={({hit}) => {
                                            const isInWishlist = !!wishlist.findItemByProductId(
                                                hit.id
                                            )

                                            return (
                                                <ProductTile
                                                    data-testid={`sf-product-tile-${hit.id}`}
                                                    key={hit.id}
                                                    product={hit}
                                                    enableFavourite={true}
                                                    isFavourite={isInWishlist}
                                                    currency={currency}
                                                    onClick={() => {
                                                        if (searchQuery) {
                                                            einstein.sendClickSearch(
                                                                searchQuery,
                                                                hit
                                                            )
                                                        } else if (category) {
                                                            einstein.sendClickCategory(
                                                                category,
                                                                hit
                                                            )
                                                        }
                                                    }}
                                                    onFavouriteToggle={(isFavourite) => {
                                                        const action = isFavourite
                                                            ? addItemToWishlist
                                                            : removeItemFromWishlist
                                                        return action(hit)
                                                    }}
                                                    dynamicImageProps={{
                                                        widths: [
                                                            '50vw',
                                                            '50vw',
                                                            '20vw',
                                                            '20vw',
                                                            '25vw'
                                                        ]
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </SimpleGrid>
                                {/* Footer */}
                                <Flex
                                    justifyContent={['center', 'center', 'flex-start']}
                                    paddingTop={16}
                                >
                                    <AlgoliaPagination onPageChange={() => window.scrollTo(0, 0)} />
                                </Flex>
                            </Box>
                        </Grid>
                    </>
                </AlgoliaNoResultsBoundary>
                {/* Filter */}
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size="full"
                    motionPreset="slideInBottom"
                    scrollBehavior="inside"
                >
                    <AlgoliaUiStateProvider searchClient={searchClient} indexName={indexName}>
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
                                <Stack spacing="6" direction="column">
                                    {filterEls}
                                </Stack>
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
                                                defaultMessage: 'View items'
                                            },
                                            {
                                                prroductCount: ''
                                            }
                                        )}
                                    </Button>
                                    <AlgoliaClearRefinements variant="button" />
                                </Stack>
                            </ModalFooter>
                        </ModalContent>
                    </AlgoliaUiStateProvider>
                </Modal>
            </InstantSearch>
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
    let productSearchResult = null

    if (searchQuery) {
        isSearch = true
    }

    // In case somebody navigates to /search without a param
    if (!categoryId && !isSearch) {
        // We will simulate search for empty string
        return {searchQuery: ' ', productSearchResult}
    }

    const searchParams = parseSearchParams(location.search, false)

    if (!searchParams.refine.includes(`cgid=${categoryId}`) && categoryId) {
        searchParams.refine.push(`cgid=${categoryId}`)
    }

    // Set the `cache-control` header values to align with the Commerce API settings.
    if (res) {
        res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    }

    const [category] = await Promise.all([
        isSearch
            ? Promise.resolve()
            : api.shopperProducts.getCategory({
                  parameters: {id: categoryId, levels: 0}
              })
    ])

    // The `isomorphic-sdk` returns error objects when they occur, so we
    // need to check the category type and throw if required.
    if (category?.type?.endsWith('category-not-found')) {
        throw new HTTPNotFound(category.detail)
    }

    return {searchQuery, productSearchResult, category}
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
