/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/** @jsx h */
/* eslint-disable react/prop-types */
import {h} from 'preact'

import {intersperse} from '../utils'

import {ChevronRightIcon} from './Icons'

export function Breadcrumb({items}) {
    return (
        <div className="aa-Breadcrumb">
            {intersperse(
                items,
                <div className="aa-ItemIcon aa-ItemIcon--noBorder aa-FavoriteIcon">
                    <ChevronRightIcon />
                </div>
            )}
        </div>
    )
}
