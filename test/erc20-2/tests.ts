import { Contract } from 'ethers';
import { TokensDepository } from './../../typechain-types/contracts/erc20-2/TokensDepository';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { IERC20, RToken } from '../../typechain-types';

describe('ERC20 Tokens Exercise 2', function () {
	let deployer: SignerWithAddress,
		aaveHolder: SignerWithAddress,
		uniHolder: SignerWithAddress,
		wethHolder: SignerWithAddress;

	const AAVE_ADDRESS = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
	const UNI_ADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
	const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

	const AAVE_HOLDER = '0x2efb50e952580f4ff32d8d2122853432bbf2e204';
	const UNI_HOLDER = '0x193ced5710223558cd37100165fae3fa4dfcdc14';
	const WETH_HOLDER = '0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3';

	const ONE_ETH = ethers.utils.parseEther('1');
	const AAVE_AMOUNT = ethers.utils.parseEther('15');
	const UNI_AMOUNT = ethers.utils.parseEther('5231');
	const WETH_AMOUNT = ethers.utils.parseEther('33');

	let aave: IERC20;
	let uni: IERC20;
	let weth: IERC20;
	type IERC20Contract = Contract | IERC20;
	let rAave: IERC20Contract;
	let rUni: IERC20Contract;
	let rWeth: IERC20Contract;

	let tokensDepository: TokensDepository;

	let initialAAVEBalance: BigNumber;
	let initialUNIBalance: BigNumber;
	let initialWETHBalance: BigNumber;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer] = await ethers.getSigners();

		// Load tokens mainnet contracts
		aave = (await ethers.getContractAt(
			'@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
			AAVE_ADDRESS
		)) as IERC20;
		uni = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', UNI_ADDRESS)) as IERC20;
		weth = (await ethers.getContractAt(
			'@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
			WETH_ADDRESS
		)) as IERC20;

		// Load holders (accounts which hold tokens on Mainnet)
		aaveHolder = await ethers.getImpersonatedSigner(AAVE_HOLDER);
		uniHolder = await ethers.getImpersonatedSigner(UNI_HOLDER);
		wethHolder = await ethers.getImpersonatedSigner(WETH_HOLDER);

		// Send some ETH to tokens holders
		await deployer.sendTransaction({
			to: aaveHolder.address,
			value: ONE_ETH,
		});
		await deployer.sendTransaction({
			to: uniHolder.address,
			value: ONE_ETH,
		});
		await deployer.sendTransaction({
			to: wethHolder.address,
			value: ONE_ETH,
		});

		initialAAVEBalance = await aave.balanceOf(aaveHolder.address);
		initialUNIBalance = await uni.balanceOf(uniHolder.address);
		initialWETHBalance = await weth.balanceOf(wethHolder.address);

		console.log('AAVE Holder AAVE Balance: ', ethers.utils.formatUnits(initialAAVEBalance));
		console.log('UNI Holder UNI Balance: ', ethers.utils.formatUnits(initialUNIBalance));
		console.log('WETH Holder WETH Balance: ', ethers.utils.formatUnits(initialWETHBalance));
	});

	it('Deploy depository and load receipt tokens', async function () {
		/** CODE YOUR SOLUTION HERE */

		// TODO: Deploy your depository contract with the supported assets
		const TokensDepository = await ethers.getContractFactory('TokensDepository');
		tokensDepository = await TokensDepository.deploy(AAVE_ADDRESS, UNI_ADDRESS, WETH_ADDRESS);

		// TODO: Load receipt tokens into objects under `this` (e.g rAve)
		rAave = await ethers.getContractAt('rToken', await tokensDepository.rTokens(AAVE_ADDRESS));
		rUni = await ethers.getContractAt('rToken', await tokensDepository.rTokens(UNI_ADDRESS));
		rWeth = await ethers.getContractAt('rToken', await tokensDepository.rTokens(WETH_ADDRESS));
	});

	it('Deposit tokens tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Deposit Tokens

		// 15 AAVE from AAVE Holder
		await aave.connect(aaveHolder).approve(tokensDepository.address, AAVE_AMOUNT);
		await tokensDepository.connect(aaveHolder).deposit(AAVE_ADDRESS, AAVE_AMOUNT);

		// 5231 UNI from UNI Holder
		await uni.connect(uniHolder).approve(tokensDepository.address, UNI_AMOUNT);
		await tokensDepository.connect(uniHolder).deposit(UNI_ADDRESS, UNI_AMOUNT);

		// 33 WETH from WETH Holder
		await weth.connect(wethHolder).approve(tokensDepository.address, WETH_AMOUNT);
		await tokensDepository.connect(wethHolder).deposit(WETH_ADDRESS, WETH_AMOUNT);

		// TODO: Check that the tokens were sucessfuly transfered to the depository
		expect(await aave.balanceOf(tokensDepository.address)).to.be.equal(AAVE_AMOUNT);
		expect(await uni.balanceOf(tokensDepository.address)).to.be.equal(UNI_AMOUNT);
		expect(await weth.balanceOf(tokensDepository.address)).to.be.equal(WETH_AMOUNT);

		// TODO: Check that the right amount of receipt tokens were minted
		expect(await rAave.balanceOf(aaveHolder.address)).to.be.equal(AAVE_AMOUNT);
		expect(await rUni.balanceOf(uniHolder.address)).to.be.equal(UNI_AMOUNT);
		expect(await rWeth.balanceOf(wethHolder.address)).to.be.equal(WETH_AMOUNT);
	});

	it('Withdraw tokens tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Withdraw ALL the Tokens
		await tokensDepository.connect(aaveHolder).withdraw(AAVE_ADDRESS, AAVE_AMOUNT);
		await tokensDepository.connect(uniHolder).withdraw(UNI_ADDRESS, UNI_AMOUNT);
		await tokensDepository.connect(wethHolder).withdraw(WETH_ADDRESS, WETH_AMOUNT);

		// TODO: Check that the right amount of tokens were withdrawn (depositors got back the assets)
		expect(await aave.balanceOf(aaveHolder.address)).to.be.equal(initialAAVEBalance);
		expect(await uni.balanceOf(uniHolder.address)).to.be.equal(initialUNIBalance);
		expect(await weth.balanceOf(wethHolder.address)).to.be.equal(initialWETHBalance);

		// TODO: Check that the right amount of receipt tokens were burned
		expect(await rAave.balanceOf(aaveHolder.address)).to.be.equal(0);
		expect(await rUni.balanceOf(uniHolder.address)).to.be.equal(0);
		expect(await rWeth.balanceOf(wethHolder.address)).to.be.equal(0);
	});
});
