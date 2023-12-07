import React from 'react';
import { Button } from "@mui/material"

type ButtonDisabledProps = {
    className?: string,
    text: string
};

const ButtonDisabled = (props: ButtonDisabledProps) => {
    return (
        <Button className={`${props.className}`} disableTouchRipple disableElevation disableRipple disableFocusRipple aria-disabled>{props.text}</Button>
    )
}

export default ButtonDisabled