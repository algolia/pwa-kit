/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import {autocomplete} from '@algolia/autocomplete-js'
import React, {createElement, Fragment, useEffect, useRef} from 'react'
import {render} from 'react-dom'
import {pipe} from 'ramda'
import {createFillWith, uniqBy} from './functions'
import {categoriesPlugin} from './plugins/categoriesPlugin'
import {popularCategoriesPlugin} from './plugins/popularCategoriesPlugin'
import {popularPlugin} from './plugins/popularPlugin'
import {productsPlugin} from './plugins/productsPlugin'
import {querySuggestionsPlugin} from './plugins/querySuggestionsPlugin'
import {quickAccessPlugin} from './plugins/quickAccessPlugin'
import {recentSearchesPlugin} from './plugins/recentSearchesPlugin'
import {isDetached} from './utils'
import {Box} from '@chakra-ui/react'
// import './style.css'
// import '@algolia/autocomplete-theme-classic'

const removeDuplicates = uniqBy(({source, item}) => {
    const sourceIds = ['recentSearchesPlugin', 'querySuggestionsPlugin']

    if (sourceIds.indexOf(source.sourceId) === -1) {
        return item
    }

    return source.sourceId === 'querySuggestionsPlugin' ? item.query : item.label
})

const fillWith = createFillWith({
    mainSourceId: 'querySuggestionsPlugin',
    limit: isDetached() ? 6 : 10
})

const combine = pipe(removeDuplicates, fillWith)

export function Autocomplete(props) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: {createElement, Fragment, render},
            ...props,
            placeholder: 'Search products',
            autoFocus: true,
            openOnFocus: true,
            plugins: [recentSearchesPlugin, querySuggestionsPlugin, categoriesPlugin],
            onSubmit: ({state}) => {
                window.location.href = `/search?q=${state.query}`
            },
            onSelect: ({state}) => {
                window.location.href = `/search?q=${state.query}`
            },
            render({elements}, root) {
                const {
                    recentSearchesPlugin: recentSearches,
                    querySuggestionsPlugin: querySuggestions,
                    categoriesPlugin: categories
                } = elements

                render(
                    <div className="aa-PanelLayout aa-Panel--scrollable">
                        <div className="aa-PanelSections">
                            <div className="aa-PanelSection--left">
                                {recentSearches}
                                {querySuggestions}
                            </div>
                            <div className="aa-PanelSection--right">
                                <div className="aa-PanelSection--products">
                                    <div className="aa-PanelSectionSource">{categories}</div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    root
                )
            },
            onStateChange: ({state}) => {
                console.log('onStateChange', state)
            }
        })

        return () => {
            search.destroy()
        }
    }, [props])

    return <Box ref={containerRef} />
}
