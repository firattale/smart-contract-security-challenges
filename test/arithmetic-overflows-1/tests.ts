import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { TimeLock, TimeLock__factory } from "../../typechain-types";

describe("Arithmetic Over/Underflow Exercise 1", function () {
    let deployer: SignerWithAddress,
        victim: SignerWithAddress,
        attacker: SignerWithAddress;

    const ONE_MONTH = 30 * 24 * 60 * 60;
    const VICTIM_DEPOSIT = parseEther("100");

    let timelock: TimeLock;
    let attackerInitialBalance: BigNumber;
    let victimInitialBalance: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, victim, attacker] = await ethers.getSigners();
        attackerInitialBalance = await ethers.provider.getBalance(
            attacker.address
        );
        victimInitialBalance = await ethers.provider.getBalance(victim.address);

        const TimeLockFactory = (await ethers.getContractFactory(
            "contracts/arithmetic-overflows-1/TimeLock.sol:TimeLock",
            deployer
        )) as TimeLock__factory;

        timelock = await TimeLockFactory.deploy();

        await timelock.connect(victim).depositETH({ value: VICTIM_DEPOSIT });
        let currentBalance = await ethers.provider.getBalance(victim.address);
        expect(currentBalance).to.be.lt(
            victimInitialBalance.sub(VICTIM_DEPOSIT)
        );

        let block = await ethers.provider.getBlock(
            await ethers.provider.getBlockNumber()
        );
        let blockTimestmap = block.timestamp;

        let victimDeposited = await timelock
            .connect(victim)
            .getBalance(victim.address);
        let lockTime = await timelock
            .connect(victim)
            .getLockTime(victim.address);

        expect(victimDeposited).to.equal(VICTIM_DEPOSIT);
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Timelock contract victim's balance supposed to be 0 (withdrawn successfuly)
        let victimDepositedAfter = await timelock
            .connect(victim)
            .getBalance(victim.address);
        expect(victimDepositedAfter).to.equal(0);

        // Attacker's should steal successfully the 100 ETH (-0.2 ETH becuase TX fees)
        let attackerCurrentBalance = await ethers.provider.getBalance(
            attacker.address
        );
        expect(attackerCurrentBalance).to.be.gt(
            attackerInitialBalance.add(VICTIM_DEPOSIT).sub(parseEther("0.2"))
        );
    });
});
