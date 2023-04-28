import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import {
    KilianExclusive,
    KilianExclusive__factory,
} from "../../typechain-types";

describe("Access Control Exercise 3", function () {
    let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress,
        attacker: SignerWithAddress;

    const FRAGRANCE_PRICE = parseEther("10");

    let kilian: KilianExclusive;
    let attackerInitialETHBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        attackerInitialETHBalance = await ethers.provider.getBalance(
            attacker.address
        );

        const KilianExclusiveFactory = (await ethers.getContractFactory(
            "contracts/access-control-3/KilianExclusive.sol:KilianExclusive",
            deployer
        )) as KilianExclusive__factory;
        kilian = await KilianExclusiveFactory.deploy();

        // Add THE LIQUORS fragrances
        await kilian.addFragrance("Apple Brandy");
        await kilian.addFragrance("Angles' Share");
        await kilian.addFragrance("Roses on Ice");
        await kilian.addFragrance("Lheure Verte");

        // Add THE FRESH fragrances
        await kilian.addFragrance("Moonligh in Heaven");
        await kilian.addFragrance("Vodka on the Rocks");
        await kilian.addFragrance("Flower of Immortality");
        await kilian.addFragrance("Bamboo Harmony");

        await kilian.flipSaleState();
    });

    it("Users are purchasing fragrances", async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        await kilian
            .connect(user1)
            .purchaseFragrance(1, { value: FRAGRANCE_PRICE });
        await kilian
            .connect(user1)
            .purchaseFragrance(4, { value: FRAGRANCE_PRICE });

        await kilian
            .connect(user2)
            .purchaseFragrance(2, { value: FRAGRANCE_PRICE });
        await kilian
            .connect(user2)
            .purchaseFragrance(3, { value: FRAGRANCE_PRICE });

        await kilian
            .connect(user3)
            .purchaseFragrance(5, { value: FRAGRANCE_PRICE });
        await kilian
            .connect(user3)
            .purchaseFragrance(8, { value: FRAGRANCE_PRICE });
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker stole all the ETH from the token sale contract
        let attackerBalance = await ethers.provider.getBalance(
            attacker.address
        );
        expect(attackerBalance).to.be.gt(
            attackerInitialETHBalance
                .add(parseEther("10").mul(6))
                .sub(parseEther("0.2"))
        );
    });
});
