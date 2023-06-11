import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { ChainLend, ChainLendAttacker, ChainLend__factory, IERC20 } from '../../typechain-types';

describe('Reentrancy Exercise 3', function () {
	const imBTC_ADDRESS = '0x3212b29E33587A00FB1C83346f5dBFA69A458923';
	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const imBTC_WHALE = '0xFEa4224Da399F672eB21a9F3F7324cEF1d7a965C';
	const USDC_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

	const USDC_IN_CHAINLEND = ethers.utils.parseUnits('1000000', 6);

	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	let chainLend: ChainLend;
	let attackerContract: ChainLendAttacker;
	let imBTC: IERC20;
	let usdc: IERC20;

	before(async () => {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await ethers.getSigners();

		// Fund deployer & attacker with 100 ETH
		await ethers.provider.send('hardhat_setBalance', [
			attacker.address,
			'0x56BC75E2D63100000', // 100 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await ethers.provider.send('hardhat_setBalance', [
			deployer.address,
			'0x56BC75E2D63100000', // 100 ETH (ETH -> WEI -> Hexdecimal)
		]);
		// Send some ETH for whales for tx fees
		await deployer.sendTransaction({
			to: USDC_WHALE,
			value: ethers.utils.parseUnits('2'),
		});
		await deployer.sendTransaction({
			to: imBTC_WHALE,
			value: ethers.utils.parseUnits('2'),
		});

		// ChainLend deployment
		const ChainLend = (await ethers.getContractFactory(
			'contracts/reentrancy-3/ChainLend.sol:ChainLend',
			deployer
		)) as ChainLend__factory;
		chainLend = await ChainLend.deploy(imBTC_ADDRESS, USDC_ADDRESS);

		// Load deployed imBTC contract & Impersonate a whale
		imBTC = (await ethers.getContractAt(
			'@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
			imBTC_ADDRESS,
			deployer
		)) as IERC20;

		// Impersonate imBTC Whale and send 1 imBTC to attacker
		const imBTCWhale = await ethers.getImpersonatedSigner(imBTC_WHALE);
		await imBTC.connect(imBTCWhale).transfer(attacker.address, ethers.utils.parseUnits('1', 8));

		// Impersonate USDC Whale and send 1M USDC to ChainLend
		const USDCWhale = await ethers.getImpersonatedSigner(USDC_WHALE);
		usdc = (await ethers.getContractAt(
			'@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
			USDC_ADDRESS,
			deployer
		)) as IERC20;
		await usdc.connect(USDCWhale).transfer(chainLend.address, USDC_IN_CHAINLEND);
	});

	it('Exploit', async () => {
		/** CODE YOUR SOLUTION HERE */
		const attackerContractFactory = await ethers.getContractFactory('ChainLendAttacker', attacker);
		attackerContract = await attackerContractFactory.deploy(chainLend.address, imBTC_ADDRESS, USDC_ADDRESS);

		await imBTC.connect(attacker).transfer(attackerContract.address, ethers.utils.parseUnits('1', 8));

		await attackerContract.attack();
	});

	after(async () => {
		/** SUCCESS CONDITIONS */

		// Attacker drained all chainlend USDC balance
		expect(await usdc.balanceOf(attacker.address)).to.be.equal(USDC_IN_CHAINLEND);
	});
});
