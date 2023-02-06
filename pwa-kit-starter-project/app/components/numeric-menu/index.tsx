/* eslint-disable header/header */
import React from 'react'
import {useNumericMenu, UseNumericMenuProps} from 'react-instantsearch-hooks'

import {Box, RadioGroup, Radio, Stack} from '@chakra-ui/react'

export type NumericMenuProps = React.ComponentProps<'div'> & UseNumericMenuProps

export function NumericMenu(props: NumericMenuProps) {
    const {items, refine} = useNumericMenu(props)

    return (
        <Box>
            <RadioGroup>
                <Stack>
                    {items.map((item) => (
                        // eslint-disable-next-line react/jsx-key
                        <Radio
                            key={item.value}
                            isChecked={item.isRefined}
                            onChange={() => refine(item.value)}
                        >
                            {item.label}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Box>
    )
}