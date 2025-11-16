// scripts/deploy-balance.js

// 主部署函数
async function main() {
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约工厂
  const BalanceContract = await ethers.getContractFactory("BalanceContract");
  
  // 部署合约
  console.log("Deploying BalanceContract...");
  const balanceContract = await BalanceContract.deploy();

  // 等待部署交易被打包确认
  await balanceContract.deployed();

  console.log("BalanceContract deployed to:", balanceContract.address);
}

// 执行主函数并处理错误
main()
  .then(() => process.exit(0)) // 成功则退出
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1); // 失败则返回非零错误码
  });