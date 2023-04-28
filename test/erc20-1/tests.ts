import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";

describe("ERC20 Tokens Exercise 1", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress;

    // Constants
    const DEPLOYER_MINT = parseEther("100000");
    const USERS_MINT = parseEther("5000");
    const FIRST_TRANSFER = parseEther("100");
    const SECOND_TRANSFER = parseEther("1000");

    // Declare variables here so they can be used in all functions
    //
    // let yourContract: YourContract;
    // let initialBalance: BigNumber;

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

        // TODO: Minting

        // TODO: Check Minting
    });

    it("Transfer tests", async function () {
        /** Transfers Tests */
        // TODO: First transfer
        // TODO: Approval & Allowance test
        // TODO: Second transfer
        // TODO: Checking balances after transfer
    });
});
