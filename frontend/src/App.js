import React, { useState, useEffect } from "react";
import { Drawer, makeStyles, Button, Typography, Grid, AppBar, Toolbar, 
  FormControl, Chip, MenuItem, InputLabel, Select } from "@material-ui/core";
import OverviewPage from "./components/overview";

const drawerWidth = 200;

// Custom styling of the tool
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: drawerWidth - 50,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const currencies = ["Euro", "USD", "GBP"];

  // useState for the currency, status and rerendering
  const [currency, setCurrency] = useState(currencies[0]);
  const [status, setStatus] = useState([{}]);
  const [random, setRandom] = useState(Math.random());

  // represents if the API is online or not
  const live = (status.gecko_says === '(V3) To the Moon!'? true : false)

  // Repsponsible for rendering
  useEffect(() => {
    reFetch();
  }, [random]);

  // Retrieves the data of the status of the API
  async function reFetch() {
    fetch("/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
      });
  }

  // Repsponsible for rerendering
  const reRender = (e) => {
    reFetch();
    setRandom(Math.random());
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            CryptoTool
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        open={true}
        variant="persistent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
        >
          <div style={{ padding: 20 }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="currency-selectlabel">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                label="Currency"
              >
                <MenuItem value={currencies[0]}>{currencies[0]}</MenuItem>
                <MenuItem value={currencies[1]}>{currencies[1]}</MenuItem>
                <MenuItem value={currencies[2]}>{currencies[2]}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
        >
          <div>
            <Button onClick={reRender} variant="contained">
              Refresh data
            </Button>
          </div>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
        >
          <div style={{ padding: 20 }}>
            <div>
              <Typography variant="subtitle1">
                Status GeckoAPI:
              </Typography>
              {live? <Chip variant="outlined" color="primary" size="small" label='Live'/> : <Chip variant="outlined" color="secondary" size="small" label='Offline'/>}
            </div>
          </div>
        </Grid>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {live ? <OverviewPage currency={currency}/> : <Typography variant="subtitle1">The API is currently offline :( Try again later!</Typography>}
      </main>
    </div>
  );
}

export default App;
