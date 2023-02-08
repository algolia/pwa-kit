/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {autocomplete} from '@algolia/autocomplete-js'
import React, {createElement, Fragment, useEffect, useRef} from 'react'
import {render} from 'react-dom'

export function Autocomplete(props) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) {
            return undefined
        }

        const search = autocomplete({
            container: containerRef.current,
            renderer: {createElement, Fragment, render},
            ...props
        })

        return () => {
            search.destroy()
        }
    }, [props])

    return <div ref={containerRef} />
}
