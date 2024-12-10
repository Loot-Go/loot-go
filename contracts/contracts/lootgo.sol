// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract lootgo is IEntropyConsumer {
    address public owner;
    IERC20 public token;
    IEntropy public entropy;
    address public latestRecipient;
    address public latestToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address entropyAddress) {
        owner = msg.sender;
        entropy = IEntropy(entropyAddress);
    }

    function requestRandomNumber(bytes32 userRandomNumber, address _latestRecipient, address _latestToken) external payable {
        address entropyProvider = entropy.getDefaultProvider();
        uint256 fee = entropy.getFee(entropyProvider);

        uint64 sequenceNumber = entropy.requestWithCallback{value: fee}(
            entropyProvider,
            userRandomNumber
        );
        latestRecipient = _latestRecipient;
        latestToken = _latestToken;
    }

    // @param sequenceNumber The sequence number of the request.
    // @param provider The address of the provider that generated the random number. If your app uses multiple providers, you can use this argument to distinguish which one is calling the app back.
    // @param randomNumber The generated random number.
    // This method is called by the entropy contract when a random number is generated.
    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        // Implement your callback logic here.
        token = IERC20(latestToken);
        uint256 amount = uint256(randomNumber) / token.balanceOf(address(this));
        require(latestRecipient != address(0), "Invalid address");
        require(
            amount <= token.balanceOf(address(this)),
            "Insufficient balance"
        );
        require(token.transfer(latestRecipient, amount), "Transfer failed");
    }

    // This method is required by the IEntropyConsumer interface.
    // It returns the address of the entropy contract which will call the callback.
    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    // Transfer tokens from the contract to a specified address
    function distribute(address recipient, address _token, uint256 amount) external onlyOwner {
        token = IERC20(_token);
        
        require(recipient != address(0), "Invalid address");
        require(
            amount <= token.balanceOf(address(this)),
            "Insufficient balance"
        );
        require(token.transfer(recipient, amount), "Transfer failed");
    }

    // Withdraw any remaining tokens back to the owner
    function withdrawTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner, balance), "Withdraw failed");
    }


}
