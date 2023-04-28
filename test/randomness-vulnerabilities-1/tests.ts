import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { Game, Game__factory } from "../../typechain-types";

describe("Randomness Vulnerabilites Exercise 1", function () {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;
    const GAME_POT = parseEther("10"); // 10 ETH

    let game: Game;

    let attackerInitialBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();
        attackerInitialBalance = await ethers.provider.getBalance(
            attacker.address
        );

        // Deploy wallet and deposit 10 ETH
        const gameFactory = (await ethers.getContractFactory(
            "contracts/randomness-vulnerabilities-1/Game.sol:Game",
            deployer
        )) as Game__factory;
        game = await gameFactory.deploy({ value: GAME_POT });

        let inGame = await ethers.provider.getBalance(game.address);
        expect(inGame).to.equal(GAME_POT);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Game funds were stolen
        expect(await ethers.provider.getBalance(game.address)).to.equal(0);

        // Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            attackerInitialBalance.add(GAME_POT).sub(parseEther("0.2"))
        );
    });
});
