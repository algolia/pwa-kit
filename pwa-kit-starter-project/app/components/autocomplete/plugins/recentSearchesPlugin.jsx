/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {
    createLocalStorageRecentSearchesPlugin,
    search
} from '@algolia/autocomplete-plugin-recent-searches'

export const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'autocomplete-two-column-layout-example',
    search(params) {
        return search({...params, limit: params.query ? 1 : 4})
    }
})
