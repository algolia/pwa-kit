/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'

import {ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME} from '../constants'
import {searchClient} from '../searchClient'

export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    indexName: ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME,
    getSearchParams({state}) {
        return {
            hitsPerPage: 5
        }
    }
})
