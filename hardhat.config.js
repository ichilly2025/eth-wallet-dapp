require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// 可选：如果需要 Etherscan 验证，可添加以下依赖（需单独安装）
// require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.28", // 兼容的 Solidity 版本
  networks: {
    // 配置本地网络（用于开发测试）
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // 配置 Sepolia 测试网（如需部署到测试网）
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  // 可选：Etherscan 验证配置（需安装 @nomiclabs/hardhat-etherscan）
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // }
};