import React from "react";
import { Box, Typography } from "@mui/material"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box component="div" sx={{ p: 3 , paddingLeft: "0", paddingRight: "0", height: "100%"}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default TabPanel