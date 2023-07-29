// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Helper interfaces to call tokens/dexes, feel free add more if necessary
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
}

interface IDEX {
    function price(uint256 xInput, uint256 xReserves, uint256 yReserves) external returns(uint256);
    function tokenToEth(uint256 tokenInput, uint256 minEthBack) external returns(uint256);
    function ethToToken(uint256 minTokensBack) external payable returns (uint256);
}

/// @notice: Try to keep contract title/file name same to streamline deployment and arb scripts
contract ArbBot {
    /*** 
     * Key Requirements:
     * 1. A function which attempts to arbitrage the two dexes
     * 2. Make the contract allow transfers of ether to it 
     * 3. Some method to withdraw any profits the contract makes
    ***/

	/// use this event in the function that attempts the arb to get picked up by the scaffold UI
	event Arb(address dexFrom, address dexTo, uint256 value, uint256 profit);
}