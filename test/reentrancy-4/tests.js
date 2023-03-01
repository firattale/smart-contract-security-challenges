const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Reentrancy Exercise 4', function () {

  let deployer, user1, user2, attacker;

  before(async () => {

    [deployer, user1, user2, attacker] = await ethers.getSigners();

    const CryptoEmpireTokenFactory = await ethers.getContractFactory(
      'contracts/reentrancy-4/CryptoEmpireToken.sol:CryptoEmpireToken',
      deployer
    );
    this.cryptoEmpireToken = await CryptoEmpireTokenFactory.deploy();

    const CryptoEmpireGameFactory = await ethers.getContractFactory(
      'contracts/reentrancy-4/CryptoEmpireGame.sol:CryptoEmpireGame',
      deployer
    );
    this.cryptoEmpireGame = await CryptoEmpireGameFactory.deploy(this.cryptoEmpireToken.address);

    // Giving 1 NFT to each user
    this.cryptoEmpireToken.mint(user1.address, 1, 0);
    this.cryptoEmpireToken.mint(user2.address, 1, 1);
    this.cryptoEmpireToken.mint(attacker.address, 1, 2);

    // The CryptoEmpire game gained many users already and has some NFTs either staked or listed in it
    for(let i=0; i <= 5; i++) {
      this.cryptoEmpireToken.mint(this.cryptoEmpireGame.address, 20, i);
    }

  });

  it('Exploit', async () => {
    /** CODE YOUR SOLUTION HERE */
    
  });

  after(async () => {

    // Attacker stole all the tokens from the game contract
    expect(await this.cryptoEmpireToken.balanceOf(attacker.address, 2)).to.be.equal(20)
    expect(await this.cryptoEmpireToken.balanceOf(this.cryptoEmpireGame.address, 2)).to.be.equal(0)

  });
});