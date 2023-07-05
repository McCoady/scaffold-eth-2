// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
}

interface IDEX {
    function price(uint256 xInput, uint256 xReserves, uint256 yReserves) external returns(uint256);
    function tokenToEth(uint256 tokenInput, uint256 minEthBack) external returns(uint256);
    function ethToToken(uint256 minTokensBack) external payable returns (uint256);
}
contract ArbBot {
    error NotOwner();
    error ZeroAddress();
    error ArbFailed();

    address public withdrawAddr = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    address public tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    uint256 public totalEthIn;

    function tryArb(address dexOne, address dexTwo) external payable {
        // Get Current balance of contract
        totalEthIn += msg.value;
        uint256 startBalance = address(this).balance;
        uint256 dexOneTokens = IERC20(tokenAddr).balanceOf(dexOne);
        uint256 tokensBack = IDEX(dexOne).price(msg.value, dexOne.balance, dexOneTokens);
        
        // txOne
        IDEX(dexOne).ethToToken{value: msg.value}(tokensBack);

        uint256 tokenBalance = IERC20(tokenAddr).balanceOf(address(this));
        IERC20(tokenAddr).approve(dexTwo, tokenBalance);

        // txTwo
        IDEX(dexTwo).tokenToEth(tokenBalance, 0);

        if (address(this).balance < startBalance) revert ArbFailed();
    }

    function withdrawFunds() external {
        if (msg.sender != withdrawAddr) revert NotOwner();

        (bool sent, ) = withdrawAddr.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {
    }    
}