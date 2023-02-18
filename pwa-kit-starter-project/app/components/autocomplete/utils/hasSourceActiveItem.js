/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export function hasSourceActiveItem(sourceId, state) {
    return Boolean(
        state.collections.find(
            (collection) =>
                collection.source.sourceId === sourceId &&
                collection.items.find((item) => item.__autocomplete_id === state.activeItemId)
        )
    )
}
