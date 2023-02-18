/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {createAlgoliaInsightsPlugin} from '@algolia/autocomplete-plugin-algolia-insights'
import insightsClient from 'search-insights'
import {appId, apiKey} from '../searchClient'

insightsClient('init', {appId, apiKey})

export const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({insightsClient})
