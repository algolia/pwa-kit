/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import {decode} from 'blurhash'
import {useEffect, useRef} from 'preact/hooks'
import {h} from 'preact'

export function Blurhash({hash, width, height, punch = 1}) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const pixels = decode(hash, width, height, punch)

        const ctx = canvasRef.current.getContext('2d')
        const imageData = ctx.createImageData(width, height)
        imageData.data.set(pixels)
        ctx.putImageData(imageData, 0, 0)
    }, [hash, width, height, punch])

    return <canvas ref={canvasRef} height={height} width={width} className="aa-BlurhashCanvas" />
}
