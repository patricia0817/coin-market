import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  createMuiTheme,
  colors,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';

const theme = createMuiTheme();

const StyledContainer = styled(Container)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.spacing(7)}px;
`;

const StyledTableHead = styled(TableHead)`
  background-color: ${colors.grey[900]};
  .MuiTableCell-head {
    color: white;
    padding: ${props => props.theme.spacing(3)}px;
    text-align: right;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: ${colors.grey[100]};
  }
  :hover {
    background-color: ${colors.grey[300]};
  }
`;

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [hasError, setHasError] = useState(false);
  let history = useHistory();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=10&page=1',
        );
        setCoins(response.data);
      } catch (_) {
        setHasError(true);
      }
    };

    fetchCoins();
  }, [setCoins]);

  function getCoinInfo(id) {
    history.push(`/coin/${id}`);
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        {coins.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">Symbol</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">High 24 hour Price</TableCell>
                  <TableCell align="right">Low 24 hour Price</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {coins.map(coin => (
                  <StyledTableRow key={coin.id} onClick={() => getCoinInfo(coin.id)}>
                    <TableCell align="right">
                      <Avatar src={coin.image} />
                    </TableCell>
                    <TableCell align="right">{coin.symbol.toUpperCase()}</TableCell>
                    <TableCell align="right">{coin['current_price']}</TableCell>
                    <TableCell align="right">{coin['high_24h']}</TableCell>
                    <TableCell align="right">{coin['low_24h']}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {hasError && <Alert severity="error">An error has occurred when trying to fetch data</Alert>}
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Home;
