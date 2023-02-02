/* eslint-disable header/header */
import React from 'react'
import {useNumericMenu, UseNumericMenuProps} from 'react-instantsearch-hooks'

import {Box, RadioGroup, Radio, Stack} from '@chakra-ui/react'

export type NumericMenuProps = React.ComponentProps<'div'> & UseNumericMenuProps

export function NumericMenu(props: NumericMenuProps) {
    const {items, refine} = useNumericMenu(props)
    console.log(items)

    return (
        <Box>
            <RadioGroup>
                <Stack>
                    {items.map((item) => (
                        // eslint-disable-next-line react/jsx-key
                        <Radio isChecked={item.isRefined} onChange={() => refine(item.value)}>{item.label}</Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Box>
    )
}