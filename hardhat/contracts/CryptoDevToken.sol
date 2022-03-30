//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";
contract CryptoDevToken is ERC20,Ownable {
  uint256 public constant maxTotalSupply = 10000 * 10**18; 
  uint256 public constant tokenPrice=0.001 ether;
  uint256 public constant tokensPerNFT= 10 * 10**18;
  ICryptoDevs CryptoDevNFT;
  mapping(unit256 => bool) public tokenIdsClaimed;
  uint256 public tokensToBeClaimed;

  constructor(address _cryptoDevContract) ERC20("Crypto Dev Token","CD"){
      CryptoDevNFT=ICryptoDevs(_cryptoDevContract);
      getTokensToBeClaimed();
  }

  function mint (uint256 amount) public payable{
      uint256 _requiredAmount = tokenPrice * amount;
      require(msg.value>=_requiredAmount,"Ether sent is incorrect");
      uint256 amountWithDecimals = amount * 10**18;
      uint256 currentSupplyOfTokens = totalSupply() + amountWithDecimals;
      require(currentSupplyOfTokens <= maxTotalSupply,
      "Exceeds the max total supply available."
      );
      _mint(msg.sender,amountWithDecimals);
  }
  function getTokensToBeClaimed() public {
      address _owner = msg.sender;
      uint256 NFTbalance = CryptoDevNFT.balanceOf(owner);
      if(NFTbalance == 0){
            tokensToBeClaimed=0;
      }
      else{
          uint256 amount=0;
          for(uint256 index=0;index<NFTbalance;index++){
              const tokenId= CryptoDevNFT.tokenofOwnerByIndex(
                  _owner, 
                  index);
               if(!tokenIdsClaimed(tokenId)){
                   amount++;
               }
          }
          tokensToBeClaimed=amount;
      }
  }
  function claim() public {
      address _owner=msg.sender;
      uint256 NFTbalance=CryptoDevNFT.balanceOf(owner);
      require(NFTbalance>0, "You don't own any Crypto Dev Nfts");
      uint256 unclaimedAmount = 0;
      for(uint256 index=0;index<NFTbalance;index++){
          uint256 _currentTokenId=CryptoDevNFT.tokenofOwnerByIndex(
              _owner, 
              index);
          if(!tokenIdsClaimed(_currentTokenId)){
              unclaimedAmount +=1;
              tokenIdsClaimed[_currentTokenId]=true;
          }
          require(unclaimedAmount>0,
          "You have already claimed all the tokens");
          _mint(msg.sender,unclaimedAmount * tokensPerNFT);
          
      }
  }
  receive() external payable {}
  fallback() external payable {}
}
