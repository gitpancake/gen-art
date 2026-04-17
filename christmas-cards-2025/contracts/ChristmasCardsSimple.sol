// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Christmas Cards 2025 - Simple Version for Testing
 * @notice A simpler version for Sepolia deployment
 */
contract ChristmasCardsSimple is ERC721, Ownable {
    uint256 public totalSupply = 0;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public mintPrice = 0.001 ether; // Cheap for testnet
    string public baseURI = "https://yourwebsite.com/christmas-cards/";
    
    constructor() ERC721("Christmas Cards 2025", "XMAS25") Ownable(msg.sender) {}
    
    function mint() public payable {
        require(totalSupply < MAX_SUPPLY, "Sold out");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = totalSupply;
        totalSupply++;
        _safeMint(msg.sender, tokenId);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked(baseURI, "?id=", _toString(tokenId)));
    }
    
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}