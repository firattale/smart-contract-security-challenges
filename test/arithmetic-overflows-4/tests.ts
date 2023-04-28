import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { PumpMeToken, PumpMeToken__factory } from "../../typechain-types";

describe("Arithmetic Over/Underflow Exercise 4", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;

    const INITIAL_SUPPLY = parseEther("1000000");

    let token: PumpMeToken;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        const pumpMeTokenFactory = (await ethers.getContractFactory(
            "contracts/arithmetic-overflows-4/PumpMeToken.sol:PumpMeToken",
            deployer
        )) as PumpMeToken__factory;

        token = await pumpMeTokenFactory.deploy(INITIAL_SUPPLY);

        let attackerBalance = await token.balanceOf(attacker.address);
        let deployerBalance = await token.balanceOf(deployer.address);
        expect(attackerBalance).to.equal(0);
        expect(deployerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker should have a lot of tokens (at least more than 1 million)
        let attackerBalanceAfter = await token.balanceOf(attacker.address);
        expect(attackerBalanceAfter).to.be.gt(INITIAL_SUPPLY);
    });
});
