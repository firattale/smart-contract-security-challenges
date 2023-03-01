require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: __dirname + '/.env' });

let scriptName = process.env.npm_lifecycle_script;

if (
  scriptName.includes('reentrancy-3') ||
  scriptName.includes('reentrancy-4') ||
  scriptName.includes('erc20-2')
) {
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: 15969633,
        },
      },
    },
    solidity: {
      compilers: [
        {
          version: '0.6.12',
        },
        {
          version: '0.5.12',
        },
        {
          version: '0.8.4',
        },
        {
          version: '0.8.13',
        },
        {
          version: '0.7.0',
        },
        {
          version: '0.6.0',
        },
        {
          version: '0.4.24',
        },
      ],
    },
  };
} else {
  module.exports = {
    networks: {
      hardhat: {
        // loggingEnabled: true
      },
    },
    solidity: {
      compilers: [
        {
          version: '0.6.12',
        },
        {
          version: '0.5.12',
        },
        {
          version: '0.8.4',
        },
        {
          version: '0.8.13',
        },
        {
          version: '0.7.0',
        },
        {
          version: '0.6.0',
        },
        {
          version: '0.4.24',
        },
      ],
    },
  };
}
