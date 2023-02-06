/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {useIntl, FormattedMessage} from 'react-intl'
import {useLocation} from 'react-router-dom'
import algoliasearch from 'algoliasearch/lite'
import {
    InstantSearch,
    SearchBox,
    Hits,
    Pagination,
    RefinementList,
    HierarchicalMenu
} from 'react-instantsearch-hooks-web'

// Components
import {
    Box,
    Button,
    SimpleGrid,
    HStack,
    VStack,
    Text,
    Flex,
    Stack,
    Container,
    Link
} from '@chakra-ui/react'

import {NumericMenu} from '../../components/numeric-menu'

// Project Components
import Hero from '../../components/hero'
import Seo from '../../components/seo'
import Section from '../../components/section'
import ProductScroller from '../../components/product-scroller'

// Others
import {getAssetUrl} from 'pwa-kit-react-sdk/ssr/universal/utils'
import {heroFeatures, features} from './data'

//Hooks
import useEinstein from '../../commerce-api/hooks/useEinstein'

// Constants
import {
    MAX_CACHE_AGE,
    HOME_SHOP_PRODUCTS_CATEGORY_ID,
    HOME_SHOP_PRODUCTS_LIMIT
} from '../../constants'

function Hit(props) {
    const price = props.hit.price ? props.hit.price.USD : 0
    // get the right image
    let imageUrl = ''
    let imageAlt = ''
    props.hit.image_groups.forEach((imageGroup) => {
        if (imageGroup.view_type == 'small') {
            imageUrl = imageGroup.images[0].dis_base_link
            imageAlt = imageGroup.images[0].alt
        }
    })
    return (
        <Section>
            <a href={`${props.hit.url}`}>
                <Flex display="flex" gridGap={4} gridAutoFlow="row dense">
                    <Section height="40px">
                        <img src={imageUrl} alt={imageAlt} />
                    </Section>
                    <Section>
                        <Text>{props.hit.name}</Text>
                        <Text fontSize="0.8em">{props.hit.short_description}</Text>
                        <Text color="red">${price}</Text>
                    </Section>
                </Flex>
            </a>
        </Section>
    )
}
/**
 * This is the home page for Retail React App.
 * The page is created for demonstration purposes.
 * The page renders SEO metadata and a few promotion
 * categories and products, data is from local file.
 */
const Home = ({productSearchResult, isLoading}) => {
    const intl = useIntl()
    const einstein = useEinstein()
    const {pathname} = useLocation()

    const searchClient = algoliasearch('YH9KIEOW1H', 'b09d6dab074870f67f7682f4aabaa474')

    /**************** Einstein ****************/
    useEffect(() => {
        einstein.sendViewPage(pathname)
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page">
            <Seo
                title="Home Page"
                description="Commerce Cloud Retail React App"
                keywords="Commerce Cloud, Retail React App, React Storefront"
            />
            <Section
                background={'gray.50'}
                marginX="auto"
                paddingY={{base: 8, md: 16}}
                paddingX={{base: 4, md: 8}}
                borderRadius="base"
                width={{base: '100vw', md: 'inherit'}}
                position={{base: 'relative', md: 'inherit'}}
                left={{base: '50%', md: 'inherit'}}
                right={{base: '50%', md: 'inherit'}}
                marginLeft={{base: '-50vw', md: 'auto'}}
                marginRight={{base: '-50vw', md: 'auto'}}
            >
                <InstantSearch
                    searchClient={searchClient}
                    indexName="zzsb_032_dx__NTOManaged__products__default"
                >
                    <SearchBox />
                    <Flex display="flex">
                        <Section>
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
                        </Section>
                        <Section>
                            <Hits hitComponent={Hit} />
                            <Pagination />
                        </Section>
                    </Flex>
                </InstantSearch>
            </Section>

            {productSearchResult && (
                <Section
                    padding={4}
                    paddingTop={16}
                    title={intl.formatMessage({
                        defaultMessage: 'Shop Products',
                        id: 'home.heading.shop_products'
                    })}
                    subtitle={intl.formatMessage(
                        {
                            defaultMessage:
                                'This section contains content from the catalog. {docLink} on how to replace it.',
                            id: 'home.description.shop_products',
                            description:
                                '{docLink} is a html button that links the user to https://sfdc.co/business-manager-manage-catalogs'
                        },
                        {
                            docLink: (
                                <Link
                                    target="_blank"
                                    href={'https://sfdc.co/business-manager-manage-catalogs'}
                                    textDecoration={'none'}
                                    position={'relative'}
                                    _after={{
                                        position: 'absolute',
                                        content: `""`,
                                        height: '2px',
                                        bottom: '-2px',
                                        margin: '0 auto',
                                        left: 0,
                                        right: 0,
                                        background: 'gray.700'
                                    }}
                                    _hover={{textDecoration: 'none'}}
                                >
                                    {intl.formatMessage({
                                        defaultMessage: 'Read docs',
                                        id: 'home.link.read_docs'
                                    })}
                                </Link>
                            )
                        }
                    )}
                >
                    <Stack pt={8} spacing={16}>
                        <ProductScroller
                            products={productSearchResult?.hits}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Section>
            )}

            <Section
                padding={4}
                paddingTop={32}
                title={intl.formatMessage({
                    defaultMessage: 'Features',
                    id: 'home.heading.features'
                })}
                subtitle={intl.formatMessage({
                    defaultMessage:
                        'Out-of-the-box features so that you focus only on adding enhancements.',
                    id: 'home.description.features'
                })}
            >
                <Container maxW={'6xl'} marginTop={10}>
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10}>
                        {features.map((feature, index) => {
                            const featureMessage = feature.message
                            return (
                                <HStack key={index} align={'top'}>
                                    <VStack align={'start'}>
                                        <Flex
                                            width={16}
                                            height={16}
                                            align={'center'}
                                            justify={'left'}
                                            color={'gray.900'}
                                            paddingX={2}
                                        >
                                            {feature.icon}
                                        </Flex>
                                        <Text color={'black'} fontWeight={700} fontSize={20}>
                                            {intl.formatMessage(featureMessage.title)}
                                        </Text>
                                        <Text color={'black'}>
                                            {intl.formatMessage(featureMessage.text)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            )
                        })}
                    </SimpleGrid>
                </Container>
            </Section>

            <Section
                padding={4}
                paddingTop={32}
                title={intl.formatMessage({
                    defaultMessage: "We're here to help",
                    id: 'home.heading.here_to_help'
                })}
                subtitle={
                    <>
                        <>
                            {intl.formatMessage({
                                defaultMessage: 'Contact our support staff.',
                                id: 'home.description.here_to_help'
                            })}
                        </>
                        <br />
                        <>
                            {intl.formatMessage({
                                defaultMessage: 'They will get you to the right place.',
                                id: 'home.description.here_to_help_line_2'
                            })}
                        </>
                    </>
                }
                actions={
                    <Button
                        as={Link}
                        href="https://help.salesforce.com/s/?language=en_US"
                        target="_blank"
                        width={'auto'}
                        paddingX={7}
                        _hover={{textDecoration: 'none'}}
                    >
                        <FormattedMessage defaultMessage="Contact Us" id="home.link.contact_us" />
                    </Button>
                }
                maxWidth={'xl'}
            />
        </Box>
    )
}

Home.getTemplateName = () => 'home'

Home.shouldGetProps = ({previousLocation, location}) =>
    !previousLocation || previousLocation.pathname !== location.pathname

Home.getProps = async ({res, api}) => {
    if (res) {
        res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    }

    const productSearchResult = await api.shopperSearch.productSearch({
        parameters: {
            refine: [`cgid=${HOME_SHOP_PRODUCTS_CATEGORY_ID}`, 'htype=master'],
            limit: HOME_SHOP_PRODUCTS_LIMIT
        }
    })

    return {productSearchResult}
}

Home.propTypes = {
    /**
     * The search result object showing all the product hits, that belong
     * in the supplied category.
     */
    productSearchResult: PropTypes.object,
    /**
     * The current state of `getProps` when running this value is `true`, otherwise it's
     * `false`. (Provided internally)
     */
    isLoading: PropTypes.bool
}

export default Home
