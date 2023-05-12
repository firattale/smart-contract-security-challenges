import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { Tale, Tale__factory } from '../../typechain-types';

describe('ERC20 Tokens Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;

	// Constants
	const DEPLOYER_MINT = parseEther('100000');
	const USERS_MINT = parseEther('5000');
	const FIRST_TRANSFER = parseEther('100');
	const SECOND_TRANSFER = parseEther('1000');

	// Declare variables here so they can be used in all functions
	//
	// let yourContract: YourContract;
	// let initialBalance: BigNumber;
	let taleToken: Tale;

	before(async function () {
		/** Deployment and minting tests */

		[deployer, user1, user2, user3] = await ethers.getSigners();

		// TODO: Contract deployment
		// Remember to import Typechain types for type-safe contract interactions
		//
		// const YourContractFactory = (await ethers.getContractFactory(
		//     "contracts/erc20-1/YourContract.sol:YourContract",
		//     deployer
		// )) as YourContract__factory; <-- Typechain Type
		//
		// yourContract = await YourContractFactory.deploy();
		//
		// `yourContract` will be of type `YourContract` from Typechain

		const TaleContractFactory = (await ethers.getContractFactory('Tale')) as Tale__factory;
		taleToken = await TaleContractFactory.deploy(DEPLOYER_MINT);
		// TODO: Minting
		await taleToken.mint(user1.address, USERS_MINT);
		await taleToken.mint(user2.address, USERS_MINT);
		await taleToken.mint(user3.address, USERS_MINT);
		// TODO: Check Minting
		expect(await taleToken.balanceOf(deployer.address)).to.equal(DEPLOYER_MINT);
		expect(await taleToken.balanceOf(user1.address)).to.equal(USERS_MINT);
		expect(await taleToken.balanceOf(user2.address)).to.equal(USERS_MINT);
		expect(await taleToken.balanceOf(user3.address)).to.equal(USERS_MINT);
	});

	it('Transfer tests', async function () {
		/** Transfers Tests */
		// TODO: First transfer
		await taleToken.connect(user2).transfer(user3.address, FIRST_TRANSFER);
		// 5000, 4900, 5100
		// TODO: Approval & Allowance test
		await taleToken.connect(user3).approve(user1.address, SECOND_TRANSFER);
		expect(await taleToken.allowance(user3.address, user1.address)).to.equal(SECOND_TRANSFER);
		// TODO: Second transfer
		// 6000, 4900, 4100
		await taleToken.connect(user1).transferFrom(user3.address, user1.address, SECOND_TRANSFER);
		// TODO: Checking balances after transfer

		expect(await taleToken.balanceOf(user1.address)).to.equal(USERS_MINT.add(SECOND_TRANSFER));
		expect(await taleToken.balanceOf(user2.address)).to.equal(USERS_MINT.sub(FIRST_TRANSFER));
		expect(await taleToken.balanceOf(user3.address)).to.equal(USERS_MINT.add(FIRST_TRANSFER).sub(SECOND_TRANSFER));
	});
});
