import React from 'react'
import PageLayout from '@src/components/layout/PageLayout'
import { Box, Tabs, Tab } from "@mui/material"
import TabPanel from '@src/components/profile/TabPanel'
import UserInfo from '@src/components/profile/UserInfo'
import StudentData from '@src/components/profile/StudentData'
import { useAuth } from '@src/context/AuthProvider'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Profile = () => {

    const { auth } = useAuth()

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PageLayout>
            <main className="grow bg-white px-10 py-10">
                <div className="max-w-screen-xl h-auto mx-auto">
                    <Box component="div" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="INFORMACIÓN PERSONAL" {...a11yProps(0)} />
                            {auth.user?.role == "teacher" ? <Tab label="ESTUDIANTES" {...a11yProps(1)} /> : null}

                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <UserInfo student={auth.user?.role !== "teacher"} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <StudentData />
                    </TabPanel>
                </div>
            </main>
        </PageLayout>
    )
}

export default Profile