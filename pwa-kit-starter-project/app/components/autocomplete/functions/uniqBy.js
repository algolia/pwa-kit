/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {normalizeReshapeSources} from './normalizeReshapeSources'

export const uniqBy = (predicate) => {
    return function runUniqBy(...rawSources) {
        const sources = normalizeReshapeSources(rawSources)
        const seen = new Set()

        return sources.map((source) => {
            const items = source.getItems().filter((item) => {
                const appliedItem = predicate({source, item})
                const hasSeen = seen.has(appliedItem)

                seen.add(appliedItem)

                return !hasSeen
            })

            return {
                ...source,
                getItems() {
                    return items
                }
            }
        })
    }
}
