const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC20 Tokens Exercise 1', function () {
    
    let deployer, user1, user2, user3;

    // Constants 
    const DEPLOYER_MINT = ethers.utils.parseEther('100000');
    const USERS_MINT = ethers.utils.parseEther('5000');
    const FIRST_TRANSFER = ethers.utils.parseEther('100');
    const SECOND_TRANSFER = ethers.utils.parseEther('1000');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2, user3] = await ethers.getSigners();

        // TODO: Contract deployment
        
        // TODO: Minting
        
        // TODO: Check Minting

    });

    it('Transfer tests', async function () {
        /** Transfers Tests */

        // TODO: First transfer

        // TODO: Approval & Allowance test

        // TODO: Second transfer

        // TODO: Checking balances after transfer
        
    });
});
