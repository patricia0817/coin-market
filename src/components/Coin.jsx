import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  colors,
  Container,
  createMuiTheme,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';

const theme = createMuiTheme();

const StyledContainer = styled(Container)`
  border: 1px solid ${colors.grey[300]};
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  margin-top: ${props => props.theme.spacing(7)}px; ;
`;

const StyledGrid = styled(Grid)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing(2)}px;
`;

const StyledSecondaryGrid = styled(Grid)`
  align-items: center;
  display: flex;
`;

const StyledDescriptionGrid = styled(Grid)`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: ${props => props.theme.spacing(2)}px;
`;

const StyledAvatar = styled(Avatar)`
  padding: ${props => props.theme.spacing()}px;
  text-transform: uppercase;

  &.MuiAvatar-colorDefault {
    background-color: ${colors.grey[900]};
  }
`;

const StyledTabPanel = styled(TabPanel)`
  text-align: left;
`;

const StyledPaper = styled(Paper)`
  margin-top: ${props => props.theme.spacing(2)}px;
  width: 100%;
`;

function TabPanel(props) {
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Coin = () => {
  let { id } = useParams();
  let history = useHistory();
  const [coin, setCoin] = useState({});
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState(0);
  const preventDefault = event => event.preventDefault();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const handleBackClick = () => {
    history.push('/');
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(response.data);
      } catch (_) {
        setHasError(true);
      }
    };

    fetchCoin();
  }, [id, setCoin]);

  return (
    <ThemeProvider theme={theme}>
      {Object.keys(coin).length !== 0 && (
        <StyledContainer maxWidth="md">
          <StyledGrid>
            <StyledSecondaryGrid>
              <IconButton onClick={() => handleBackClick()} aria-label="back" size="medium">
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="h3">{coin.name}</Typography>
            </StyledSecondaryGrid>
            <StyledAvatar aria-label="symbol">{coin.symbol}</StyledAvatar>
          </StyledGrid>
          <Divider />
          <StyledGrid>
            <Typography variant="h6">Hashing Algorithm</Typography>
            <Typography variant="subtitle1">{coin['hashing_algorithm']}</Typography>
          </StyledGrid>
          <Divider />
          <StyledGrid>
            <Typography variant="h6">Market cap in Euro</Typography>
            <Typography variant="subtitle1">{coin['market_data'] && coin['market_data']['market_cap'].eur}</Typography>
          </StyledGrid>
          <Divider />
          <StyledGrid>
            <Typography variant="h6">Homepage</Typography>
            <Typography variant="subtitle1">
              <Link href="#" onClick={preventDefault}>
                {coin.links && coin.links.homepage}
              </Link>
            </Typography>
          </StyledGrid>
          <Divider />
          <StyledGrid>
            <Typography variant="h6">Genesis Date</Typography>
            <Typography variant="subtitle1">{coin['genesis_date']}</Typography>
          </StyledGrid>
          <Divider />
          <StyledDescriptionGrid>
            <Typography component="div" variant="h6">
              Description
            </Typography>
            <StyledPaper>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="description"
                variant="scrollable"
                scrollButtons="auto"
              >
                {coin.description &&
                  Object.entries(coin.description).map(([key, _], index) => (
                    <Tab label={key} {...a11yProps(index)} key={key}></Tab>
                  ))}
              </Tabs>
            </StyledPaper>
            {coin.description &&
              Object.entries(coin.description).map(([key, item], index) => (
                <StyledTabPanel value={value} index={index} key={key}>
                  <span
                    dangerouslySetInnerHTML={{ __html: `${item.replace(/(<? *script)/gi, 'illegalscript')}` }}
                  ></span>
                </StyledTabPanel>
              ))}
          </StyledDescriptionGrid>
        </StyledContainer>
      )}
      {hasError && (
        <Container maxWidth="sm">
          <Box m="50px">
            <Alert severity="error">An error has occurred when trying to fetch data</Alert>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default Coin;
