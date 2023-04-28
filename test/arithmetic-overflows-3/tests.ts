import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { AIvestICO, AIvestICO__factory, IERC20 } from "../../typechain-types";

describe("Arithmetic Over/Underflow Exercise 3", function () {
    let deployer: SignerWithAddress,
        investor1: SignerWithAddress,
        investor2: SignerWithAddress,
        investor3: SignerWithAddress,
        attacker: SignerWithAddress;

    // Investment amounts (in ETH)
    const FIRST_INVESTOR_INVESTED = parseEther("520");
    const SECOND_INVESTOR_INVESTED = parseEther("126");
    const THIRD_INVESTOR_INVESTED = parseEther("54");
    const SECOND_INVESTOR_REFUNDED = parseEther("26");

    const TOTAL_INVESTED = FIRST_INVESTOR_INVESTED.add(SECOND_INVESTOR_INVESTED)
        .add(THIRD_INVESTOR_INVESTED)
        .sub(SECOND_INVESTOR_REFUNDED);

    let ico: AIvestICO;
    let token: IERC20;
    let initialAttackerBalancer: BigNumber;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, investor1, investor2, investor3, attacker] =
            await ethers.getSigners();

        // Attacker starts with 1 ETH
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xDE0B6B3A7640000", // 1 ETH
        ]);
        initialAttackerBalancer = await ethers.provider.getBalance(
            attacker.address
        );
        expect(initialAttackerBalancer).to.be.equal(parseEther("1"));

        // Deploy
        const AIvestICOFactory = (await ethers.getContractFactory(
            "contracts/arithmetic-overflows-3/AIvestICO.sol:AIvestICO",
            deployer
        )) as AIvestICO__factory;
        ico = await AIvestICOFactory.deploy();
        // Get Token Contract
        token = (await ethers.getContractAt(
            "contracts/arithmetic-overflows-3/AIvestToken.sol:IERC20",
            await ico.token()
        )) as IERC20;
    });

    it("Investments Tests", async function () {
        // Should Fail (no ETH)
        await expect(
            ico.connect(investor1).buy(FIRST_INVESTOR_INVESTED.mul(10))
        ).to.be.revertedWith("wrong ETH amount sent");

        // Should Succeed
        await ico.connect(investor1).buy(FIRST_INVESTOR_INVESTED.mul(10), {
            value: FIRST_INVESTOR_INVESTED,
        });
        await ico.connect(investor2).buy(SECOND_INVESTOR_INVESTED.mul(10), {
            value: SECOND_INVESTOR_INVESTED,
        });
        await ico.connect(investor3).buy(THIRD_INVESTOR_INVESTED.mul(10), {
            value: THIRD_INVESTOR_INVESTED,
        });

        // Tokens and ETH balance checks
        expect(await token.balanceOf(investor1.address)).to.be.equal(
            FIRST_INVESTOR_INVESTED.mul(10)
        );
        expect(await token.balanceOf(investor2.address)).to.be.equal(
            SECOND_INVESTOR_INVESTED.mul(10)
        );
        expect(await token.balanceOf(investor3.address)).to.be.equal(
            THIRD_INVESTOR_INVESTED.mul(10)
        );

        expect(await ethers.provider.getBalance(ico.address)).to.be.equal(
            FIRST_INVESTOR_INVESTED.add(SECOND_INVESTOR_INVESTED).add(
                THIRD_INVESTOR_INVESTED
            )
        );
    });

    it("Refund Tests", async function () {
        // Should Fail (investor doesn't own so many tokens)
        await expect(
            ico.connect(investor2).refund(SECOND_INVESTOR_INVESTED.mul(100))
        ).to.be.revertedWith("ERC20: burn amount exceeds balance");

        // Should succeed
        await ico.connect(investor2).refund(SECOND_INVESTOR_REFUNDED.mul(10));

        // Tokens and ETH balance check
        expect(await ethers.provider.getBalance(ico.address)).to.be.equal(
            TOTAL_INVESTED
        );
        expect(await token.balanceOf(investor2.address)).to.be.equal(
            SECOND_INVESTOR_INVESTED.sub(SECOND_INVESTOR_REFUNDED).mul(10)
        );
    });

    it("Exploit", async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker should drain all ETH from ICO contract
        expect(await ethers.provider.getBalance(ico.address)).to.be.equal(0);
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            initialAttackerBalancer.add(TOTAL_INVESTED).sub(parseEther("0.2"))
        );
    });
});
