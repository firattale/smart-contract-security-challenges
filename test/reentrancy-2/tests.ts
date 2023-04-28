import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import {
    ApesAirdrop,
    ApesAirdrop__factory,
    ApesAttacker__factory,
} from "../../typechain-types";

describe("Reentrancy Exercise 2", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress,
        user4: SignerWithAddress,
        attacker: SignerWithAddress;

    let users;
    const TOTAL_SUPPLY = 50;

    let airdrop: ApesAirdrop;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, user4, attacker] =
            await ethers.getSigners();
        users = [user1, user2, user3, user4, attacker];

        const ApesAirdropFactory = (await ethers.getContractFactory(
            "contracts/reentrancy-2/ApesAirdrop.sol:ApesAirdrop",
            deployer
        )) as ApesAirdrop__factory;

        airdrop = await ApesAirdropFactory.deploy();

        await airdrop.addToWhitelist(users.map((user) => user.address));

        for (let i = 0; i < users.length; i++) {
            expect(await airdrop.isWhitelisted(users[i].address)).to.equal(
                true
            );
        }
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(await airdrop.balanceOf(attacker.address)).to.equal(
            TOTAL_SUPPLY
        );
    });
});
