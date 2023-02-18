/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {flatten} from '@algolia/autocomplete-shared'

// We filter out falsy values because dynamic sources may not exist at every render.
// We flatten to support pipe operators from functional libraries like Ramda.
export function normalizeReshapeSources(sources) {
    return flatten(sources).filter(Boolean)
}
