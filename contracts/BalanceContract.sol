pragma solidity ^0.8.28;

contract BalanceContract {
    // 读取合约余额
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 接收ETH（ payable 关键字允许合约接收ETH）
    receive() external payable {}
}