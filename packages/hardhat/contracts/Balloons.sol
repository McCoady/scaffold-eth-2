pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Balloons is ERC20 {
    address txSpoofer = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address arbBot = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    constructor() ERC20("Balls", "BAL") {
        _mint(msg.sender, 10_000 ether); // mints 1000 balloons!
        _mint(txSpoofer, 10_000 ether);
        _mint(arbBot, 10_000 ether);
    }
}