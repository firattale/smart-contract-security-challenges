const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC721 Tokens Exercise 1', function () {
    
    let deployer, user1, user2;

    // Constants 
    const DEPLOYER_MINT = 5;
    const USER1_MINT = 3;
    const MINT_PRICE = ethers.utils.parseEther('0.1');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2] = await ethers.getSigners();

        /** CODE YOUR SOLUTION HERE */
        // TODO: Contract deployment

    });

    it('Minting Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deployer mints
        // Deployer should own token ids 1-5
        
        // TODO: User 1 mints
        // User1 should own token ids 6-8
        
        // TODO: Check Minting
    });

    it('Transfers Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Transfering tokenId 6 from user1 to user2

        // TODO: Checking that user2 owns tokenId 6


        // TODO: Deployer approves User1 to spend tokenId 3
        
        // TODO: Test that User1 has approval to spend TokenId3
        
        
        // TODO: Use approval and transfer tokenId 3 from deployer to User1
        
        // TODO: Checking that user1 owns tokenId 3
        

        // TODO: Checking balances after transfer
        // Deployer: 5 minted, 1 sent, 0 received
        
        // User1: 3 minted, 1 sent, 1 received
        
        // User2: 0 minted, 0 sent, 1 received
        
    });
});
