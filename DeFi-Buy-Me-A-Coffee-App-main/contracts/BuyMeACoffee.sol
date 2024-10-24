//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Deploy on Goerli Testnet at: 0x30F99eCb9DdD2C518D532D7e1f38246895C272c5

contract BuyMeACoffee {
    // Event when a Memo is Created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all the Memos received from friends
    Memo[] memos;

    // Address of the contract deployer
    address payable owner;

    // Deploy logic
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        // Add the memo to the storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a log event when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in the contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemo() public view returns (Memo[] memory) {
        return memos;
    }
}
