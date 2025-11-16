# ETH Wallet DApp

一个基于以太坊的去中心化应用（DApp），用于查询合约余额和向合约转账 ETH。

## 项目简介

这是一个简单的以太坊 DApp，包含：
- 智能合约：用于接收和存储 ETH
- 前端界面：连接 MetaMask 钱包，查询余额，向合约转账
- 支持 Sepolia 测试网和本地开发网络

## 技术栈

- **智能合约**: Solidity ^0.8.28
- **开发框架**: Hardhat 2.26.3
- **前端**: HTML + JavaScript + ethers.js
- **钱包集成**: MetaMask
- **网络**: Sepolia 测试网 / 本地网络

## 项目结构

```
eth-wallet-dapp/
├── contracts/
│   └── BalanceContract.sol     # 智能合约
├── scripts/
│   └── deploy-balance.js       # 部署脚本
├── frontend/
│   ├── index.html             # 前端页面
│   └── app.js                 # 前端逻辑
├── hardhat.config.js          # Hardhat 配置
├── package.json               # 项目依赖
└── .env                       # 环境变量
```

## 功能特性

### 智能合约功能
- ✅ 接收 ETH 转账（`receive()` 函数）
- ✅ 查询合约 ETH 余额（`getContractBalance()` 函数）

### 前端功能
- ✅ 连接 MetaMask 钱包
- ✅ 自动检测网络并切换到支持的网络
- ✅ 显示当前账户地址
- ✅ 查询账户 ETH 余额
- ✅ 查询合约 ETH 余额
- ✅ 向合约转账 ETH
- ✅ 实时更新余额

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/ichilly2025/eth-wallet-dapp.git
cd eth-wallet-dapp

# 安装依赖
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：
```env
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_private_key_for_deployment
```

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 部署合约

#### 部署到本地网络：
```bash
# 启动本地网络
npx hardhat node

# 部署合约（新终端）
npx hardhat run scripts/deploy-balance.js --network localhost
```

#### 部署到 Sepolia 测试网：
```bash
npx hardhat run scripts/deploy-balance.js --network sepolia
```

### 5. 启动前端

```bash
# 进入前端目录
cd frontend

# 启动本地服务器
python3 -m http.server 8000
# 或者
python -m http.server 8000
```

访问：http://localhost:8000

## 使用说明

### MetaMask 配置

#### Sepolia 测试网：
- 网络名称: Sepolia Test Network
- RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- 链 ID: 11155111
- 货币符号: ETH
- 区块浏览器: https://sepolia.etherscan.io

#### 本地网络：
- 网络名称: Localhost 8545
- RPC URL: http://127.0.0.1:8545
- 链 ID: 31337
- 货币符号: ETH

### 获取测试 ETH

Sepolia 测试网水龙头：
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### 使用步骤

1. **连接钱包**
   - 点击"连接 MetaMask"按钮
   - 确认连接请求

2. **网络检查**
   - 如果不在支持的网络，会提示切换
   - 支持自动切换到 Sepolia 测试网

3. **查看余额**
   - 自动显示账户 ETH 余额
   - 自动显示合约 ETH 余额

4. **转账到合约**
   - 输入转账金额（ETH）
   - 点击"转账到合约"
   - 确认 MetaMask 交易

## 合约地址

### Sepolia 测试网
```
合约地址: 0xe8c69CB5872FD4Ab5ce53E775861e28F06c1fB3D
```

### 本地网络
```
默认地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3
（每次重新部署会变化）
```

## 开发说明

### 合约开发
```bash
# 编译合约
npx hardhat compile

# 运行测试
npx hardhat test

# 部署到本地
npx hardhat run scripts/deploy-balance.js --network localhost
```

### 前端开发
- 修改 `frontend/app.js` 中的合约地址
- 确保 ethers.js 版本兼容性
- 测试不同网络的连接

## 故障排除

### 常见问题

1. **ethers.js 加载失败**
   - 检查网络连接
   - 尝试刷新页面

2. **MetaMask 连接失败**
   - 确保已安装 MetaMask
   - 检查网络配置

3. **合约调用失败**
   - 确认合约地址正确
   - 检查网络是否匹配
   - 确保账户有足够的 ETH 支付 gas

4. **交易失败**
   - 检查账户余额
   - 确认 gas 费用设置
   - 查看 MetaMask 错误信息

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- GitHub: [@ichilly2025](https://github.com/ichilly2025)
- 项目地址: https://github.com/ichilly2025/eth-wallet-dapp