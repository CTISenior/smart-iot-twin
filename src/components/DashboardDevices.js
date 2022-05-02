import { Container, Grid } from '@mui/material'
import axios from 'axios';
import React from 'react'
import DeviceCard from './DeviceCard';
import { SnackbarProvider } from 'notistack';
import io from 'socket.io-client';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const socket = io("http://176.235.202.77:4001/", { transports: ['websocket', 'polling', 'flashsocket'] })



const DashboardDevices = (props) => {
    const { tenantID } = props;
    const [devices, setDevices] = React.useState([]);
    const [topics, setTopics] = React.useState([]);
    const [graphList, setGraphList] = React.useState([]);

    React.useEffect(async () => {
        const tempDevices = [];
        const tempTopics = [];
        const tempGraphList = [];

        axios.get(`http://176.235.202.77:4000/api/v1/tenants/${tenantID}/devices`).then((response) => {
            if (response != null) {
                response.data.forEach(element => {
                    const temp = { name: element.name, id: element.id, sn: element.sn, building_id: element.building_id, types: element.types };
                    tempDevices.push(temp);
                    tempTopics.push(element.sn);
                    console.log(element.types);
                    // tempGraphList.push({ id: element.sn, temperature: [], humidity: [] });

                });
                // setGraphList(tempGraphList);
                setTopics(tempTopics);
                setDevices(tempDevices);

            }
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }, []);


    function sendGraphList(id) {
        return graphList.filter(item => item.id === id ? item : "");
    }
    return (
        <Container>
            <SnackbarProvider maxSnack={3}>
                <Grid item xs={12} md={6} lg={6} sx={{ marginBottom: 5 }}>
                    <Button href="/dashboard" variant="contained"
                        startIcon={<ArrowBackIcon style={{ borderRight: '1px solid white', borderRightWidth: '1px' }} />} style={{ color: '#FFF' }}>
                        Back to dashboard
                    </Button>
                </Grid>

                <Grid container spacing={3}>

                    {devices.map(element => {
                        return (
                            < DeviceCard name={element.name} id={element.id} sn={element.sn} building_id={element.building_id} types={element.types} socket={socket} list={sendGraphList(element.id)} />
                        );
                    })}
                </Grid>
            </SnackbarProvider>

        </Container >
    )
}

export default DashboardDevices