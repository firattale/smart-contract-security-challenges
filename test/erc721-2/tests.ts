import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { expect } from 'chai';
import { DummyERC721, DummyERC721__factory, OpenOcean } from '../../typechain-types';

describe('ERC721 Tokens Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;
	let nftMarketplace: OpenOcean;
	const CUTE_NFT_PRICE = parseEther('5');
	const BOOBLES_NFT_PRICE = parseEther('7');

	let cuteNFT: DummyERC721;
	let booblesNFT: DummyERC721;

	let user1InitialBalance: BigNumber;
	let user2InitialBalance: BigNumber;
	let user3InitialBalance: BigNumber;

	before(async function () {
		/** Deployment and minting tests */

		[deployer, user1, user2, user3] = await ethers.getSigners();

		// User1 creates his own NFT collection
		let NFTFactory = (await ethers.getContractFactory(
			'contracts/utils/DummyERC721.sol:DummyERC721',
			user1
		)) as DummyERC721__factory;
		cuteNFT = await NFTFactory.deploy('Crypto Cuties', 'CUTE', 1000);

		await cuteNFT.mintBulk(30);
		expect(await cuteNFT.balanceOf(user1.address)).to.be.equal(30);

		// User3 creates his own NFT collection
		NFTFactory = await ethers.getContractFactory('DummyERC721', user3);
		booblesNFT = await NFTFactory.deploy('Rare Boobles', 'BOO', 10000);
		await booblesNFT.mintBulk(120);
		expect(await booblesNFT.balanceOf(user3.address)).to.be.equal(120);

		// Store users initial balance
		user1InitialBalance = await ethers.provider.getBalance(user1.address);
		user2InitialBalance = await ethers.provider.getBalance(user2.address);
		user3InitialBalance = await ethers.provider.getBalance(user3.address);
	});

	it('Deployment & Listing Tests', async function () {
		/** CODE YOUR SOLUTION HERE */

		// TODO: Deploy Marketplace from deployer
		const NFTMarketplace = await ethers.getContractFactory('OpenOcean');
		nftMarketplace = await NFTMarketplace.deploy();

		// TODO: User1 lists Cute NFT tokens 1-10 for 5 ETH each
		await cuteNFT.setApprovalForAll(nftMarketplace.address, true);

		for (let i = 1; i <= 10; i++) {
			await nftMarketplace.connect(user1).listItem(cuteNFT.address, i, CUTE_NFT_PRICE);
		}
		// TODO: Check that Marketplace owns 10 Cute NFTs
		expect(await nftMarketplace.itemsCounter()).to.be.equal(10);
		let cuteCounter = 0;
		let itemsCounter = await nftMarketplace.itemsCounter();
		for (let i = 1; i <= Number(itemsCounter); i++) {
			let item = await nftMarketplace.listedItems(i);
			if (item.collectionContract === cuteNFT.address) cuteCounter++;
		}
		expect(cuteCounter).to.be.equal(10);

		// TODO: Checks that the marketplace mapping is correct (All data is correct), check the 10th item.
		const tenthItem = await nftMarketplace.listedItems(10);

		expect(tenthItem.seller).to.be.equal(user1.address);
		expect(tenthItem.collectionContract).to.be.equal(cuteNFT.address);
		expect(tenthItem.tokenId).to.be.equal(10);
		expect(tenthItem.price).to.be.equal(CUTE_NFT_PRICE);
		expect(tenthItem.isSold).to.be.equal(false);
		expect(tenthItem.itemId).to.be.equal(10);

		// TODO: User3 lists Boobles NFT tokens 1-5 for 7 ETH each
		await booblesNFT.setApprovalForAll(nftMarketplace.address, true);

		for (let i = 1; i <= 5; i++) {
			await nftMarketplace.connect(user3).listItem(booblesNFT.address, i, BOOBLES_NFT_PRICE);
		}

		// TODO: Check that Marketplace owns 5 Booble NFTs

		let boobleCounter = 0;
		itemsCounter = await nftMarketplace.itemsCounter();
		for (let i = 1; i <= Number(itemsCounter); i++) {
			let item = await nftMarketplace.listedItems(i);
			if (item.collectionContract === booblesNFT.address) boobleCounter++;
		}
		expect(boobleCounter).to.be.equal(5);

		// TODO: Checks that the marketplace mapping is correct (All data is correct), check the 15th item.
		const fifteenthItem = await nftMarketplace.listedItems(15);

		expect(fifteenthItem.seller).to.be.equal(user3.address);
		expect(fifteenthItem.collectionContract).to.be.equal(booblesNFT.address);
		expect(fifteenthItem.tokenId).to.be.equal(5);
		expect(fifteenthItem.price).to.be.equal(BOOBLES_NFT_PRICE);
		expect(fifteenthItem.isSold).to.be.equal(false);
		expect(fifteenthItem.itemId).to.be.equal(15);
	});

	it('Purchases Tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// All Purchases From User2 //
		// TODO: Try to purchase itemId 100, should revert
		await expect(nftMarketplace.connect(user2).purchase(100)).to.be.revertedWith('Item does not exist');
		// TODO: Try to purchase itemId 3, without ETH, should revert
		await expect(nftMarketplace.connect(user2).purchase(3)).to.be.revertedWith("You didn't send enough ETH");

		// TODO: Try to purchase itemId 3, with ETH, should work
		await nftMarketplace.connect(user2).purchase(3, { value: CUTE_NFT_PRICE });

		// TODO: Can't purchase sold item
		await expect(nftMarketplace.connect(user2).purchase(3, { value: CUTE_NFT_PRICE })).to.be.revertedWith(
			'Item already sold'
		);

		// TODO: User2 owns itemId 3 -> Cuties tokenId 3
		const item3 = await nftMarketplace.listedItems(3);
		expect(await cuteNFT.connect(user2).ownerOf(item3.tokenId)).to.be.equal(user2.address);

		expect(await cuteNFT.connect(user2).ownerOf(3)).to.be.equal(user2.address);
		// TODO: User1 got the right amount of ETH for the sale
		const user1Balance = await ethers.provider.getBalance(user1.address);
		expect(user1Balance).to.be.gt(user1InitialBalance.add(CUTE_NFT_PRICE).sub(ethers.utils.parseEther('0.2')));

		// TODO: Purchase itemId 11
		await nftMarketplace.connect(user2).purchase(11, { value: BOOBLES_NFT_PRICE });

		// TODO: User2 owns itemId 11 -> Boobles tokenId 1
		const item11 = await nftMarketplace.listedItems(11);
		expect(await booblesNFT.connect(user2).ownerOf(item11.tokenId)).to.be.equal(user2.address);

		// TODO: User3 got the right amount of ETH for the sale
		let user3Balance = await ethers.provider.getBalance(user3.address);
		expect(user3Balance).to.be.gt(user3InitialBalance.add(BOOBLES_NFT_PRICE).sub(ethers.utils.parseEther('0.2')));
	});
});
