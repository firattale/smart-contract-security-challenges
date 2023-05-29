import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import {
	SimpleSmartWallet,
	SimpleSmartWallet__factory,
	AttackSimpleSmartWallet,
	AttackSimpleSmartWallet__factory,
} from '../../typechain-types';

describe('TX Origin Phishing Exercise 1', function () {
	let fundManager: SignerWithAddress, attacker: SignerWithAddress;

	const HEDGE_FUND_DEPOSIT = parseEther('2800'); // 2800 ETH
	const CHARITY_DONATION = parseEther('0.1'); // 0.1 ETH

	let wallet: SimpleSmartWallet;
	let attackerContract: AttackSimpleSmartWallet; // TODO - Replace "any" with your contract type

	let attackerInitialEthBalance: BigNumber;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[fundManager, attacker] = await ethers.getSigners();

		attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address);

		const simpleSmartWalletFactory = (await ethers.getContractFactory(
			'contracts/tx-origin-phishing-1/SimpleSmartWallet.sol:SimpleSmartWallet',
			fundManager
		)) as SimpleSmartWallet__factory;
		wallet = await simpleSmartWalletFactory.deploy({
			value: HEDGE_FUND_DEPOSIT,
		});

		let smartWalletBalance = await ethers.provider.getBalance(wallet.address);
		expect(smartWalletBalance).to.equal(HEDGE_FUND_DEPOSIT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		const attackSmartWalletFactory = await ethers.getContractFactory('AttackSimpleSmartWallet', attacker);
		attackerContract = await attackSmartWalletFactory.deploy(wallet.address);
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Fund manager is tricked to send a donation to the "charity" (attacker's contract)
		await fundManager.sendTransaction({
			to: attackerContract.address,
			value: CHARITY_DONATION,
		});

		// Smart wallet supposed to be emptied
		let walletBalance = await ethers.provider.getBalance(wallet.address);
		expect(walletBalance).to.equal(0);

		// Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
		expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
			attackerInitialEthBalance.add(HEDGE_FUND_DEPOSIT).sub(parseEther('0.2'))
		);
	});
});
