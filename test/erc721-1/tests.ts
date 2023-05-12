import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { MyNFT } from '../../typechain-types';

describe('ERC721 Tokens Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
	let myNft: MyNFT;
	// Constants
	const DEPLOYER_MINT = 5;
	const USER1_MINT = 3;
	const MINT_PRICE = parseEther('0.1');

	// Declare variables here so they can be used in all functions
	//
	// let yourContract: YourContract;
	// let initialBalance: BigNumber;

	before(async function () {
		/** Deployment and minting tests */

		[deployer, user1, user2] = await ethers.getSigners();

		/** CODE YOUR SOLUTION HERE */
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
		const MyNFT = await ethers.getContractFactory('MyNFT');
		myNft = await MyNFT.deploy();
	});

	it('Minting Tests', async function () {
		/** CODE YOUR SOLUTION HERE */

		// TODO: Deployer mints
		await myNft.safeMint(deployer.address, { value: MINT_PRICE });
		await myNft.safeMint(deployer.address, { value: MINT_PRICE });
		await myNft.safeMint(deployer.address, { value: MINT_PRICE });
		await myNft.safeMint(deployer.address, { value: MINT_PRICE });
		await myNft.safeMint(deployer.address, { value: MINT_PRICE });
		// Deployer should own token ids 1-5
		// TODO: User 1 mints
		await myNft.connect(user1).safeMint(user1.address, { value: MINT_PRICE });
		await myNft.connect(user1).safeMint(user1.address, { value: MINT_PRICE });
		await myNft.connect(user1).safeMint(user1.address, { value: MINT_PRICE });

		// User1 should own token ids 6-8
		// TODO: Check Minting
		expect(await myNft.balanceOf(deployer.address)).to.be.equal(DEPLOYER_MINT);
		expect(await myNft.balanceOf(user1.address)).to.be.equal(USER1_MINT);
	});

	it('Transfers Tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Transfering tokenId 6 from user1 to user2
		await myNft.connect(user1).transferFrom(user1.address, user2.address, 6);
		// TODO: Checking that user2 owns tokenId 6
		expect(await myNft.ownerOf(6)).to.be.equal(user2.address);
		// TODO: Deployer approves User1 to spend tokenId 3
		await myNft.approve(user1.address, 3);
		// TODO: Test that User1 has approval to spend TokenId3
		expect(await myNft.getApproved(3)).to.be.equal(user1.address);
		// TODO: Use approval and transfer tokenId 3 from deployer to User1
		await myNft.connect(user1).transferFrom(deployer.address, user1.address, 3);
		// TODO: Checking that user1 owns tokenId 3
		expect(await myNft.ownerOf(3)).to.be.equal(user1.address);
		// TODO: Checking balances after transfer
		expect(await myNft.balanceOf(deployer.address)).to.be.equal(4);
		expect(await myNft.balanceOf(user1.address)).to.be.equal(3);
		expect(await myNft.balanceOf(user2.address)).to.be.equal(1);

		// Deployer: 5 minted, 1 sent, 0 received
		// User1: 3 minted, 1 sent, 1 received
		// User2: 0 minted, 0 sent, 1 received
	});
});
