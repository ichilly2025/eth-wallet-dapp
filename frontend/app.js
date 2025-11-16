// 检查 ethers.js 是否加载
if (typeof ethers === 'undefined') {
  console.error('ethers.js 未加载');
  alert('ethers.js 库加载失败，请检查网络连接或刷新页面');
}

// 全局变量
let provider;
let signer;
let contract;

// 合约配置
const CONTRACTS = {
  // Sepolia 测试网
  sepolia: {
    address: "0xe8c69CB5872FD4Ab5ce53E775861e28F06c1fB3D",
    chainId: 11155111,
    name: "Sepolia 测试网"
  },
  // 本地网络 (需要先部署合约)
  localhost: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // 本地部署的默认地址
    chainId: 31337,
    name: "本地网络"
  }
};

// 支持的网络
const SUPPORTED_NETWORKS = {
  1: "以太坊主网",
  11155111: "Sepolia 测试网", 
  31337: "本地网络"
};

const CONTRACT_ABI = [
  "function getContractBalance() public view returns (uint256)"
  // 注意: receive() 函数不需要在 ABI 中显式定义
  // 它是一个特殊的函数，可以直接向合约地址发送 ETH
];

// 当前使用的合约配置
let currentContract = CONTRACTS.localhost; // 默认使用本地网络

// DOM 元素
const statusEl = document.getElementById("status");
const accountEl = document.getElementById("account");
const ethBalanceEl = document.getElementById("ethBalance");
const contractBalanceEl = document.getElementById("contractBalance");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const transferBtn = document.getElementById("transferBtn");
const amountInput = document.getElementById("amount");

// 页面加载完成后初始化
window.onload = () => {
  console.log("页面加载完成");
  
  // 检查 MetaMask
  if (typeof window.ethereum !== 'undefined') {
    console.log("MetaMask 已检测到");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    statusEl.textContent = "MetaMask 已检测到，点击连接";
    statusEl.style.background = "#d1ecf1";
    
    // 监听账户变化
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log("账户变化:", accounts);
      if (accounts.length > 0) {
        initContract(accounts[0]);
      } else {
        resetUI();
      }
    });

    // 监听网络变化
    window.ethereum.on("chainChanged", (chainId) => {
      console.log("网络变化:", chainId);
      window.location.reload(); // 简单重新加载页面
    });
    
  } else {
    console.log("未检测到 MetaMask");
    statusEl.textContent = "请安装 MetaMask！";
    statusEl.style.background = "#f8d7da";
    connectBtn.disabled = true;
  }
};

// 连接钱包
connectBtn.addEventListener("click", async () => {
  console.log("点击了连接按钮");
  
  if (!window.ethereum) {
    alert("请安装 MetaMask!");
    return;
  }

  try {
    statusEl.textContent = "正在连接...";
    statusEl.style.background = "#fff3cd";
    
    // 确保 provider 已初始化
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    
    // 请求连接账户
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    console.log("获取到账户:", accounts);
    
    if (accounts.length > 0) {
      // 初始化合约
      await initContract(accounts[0]);
    } else {
      throw new Error("未获取到账户");
    }

  } catch (error) {
    console.error("连接失败:", error);
    statusEl.textContent = `连接失败: ${error.message}`;
    statusEl.style.background = "#f8d7da";
  }
});

// 断开连接（前端模拟，MetaMask无真正断开）
disconnectBtn.addEventListener("click", resetUI);

// 向合约转账
transferBtn.addEventListener("click", async () => {
  if (!signer || !contract) return;

  const amount = amountInput.value;
  if (isNaN(amount) || amount <= 0) {
    alert("请输入有效的转账金额！");
    return;
  }

  try {
    statusEl.textContent = "转账中...";
    statusEl.style.background = "#fff3cd";

    // 转账ETH到合约（单位：wei）
    const tx = await signer.sendTransaction({
      to: currentContract.address,
      value: ethers.utils.parseEther(amount)
    });

    // 等待交易确认
    await tx.wait();

    statusEl.textContent = "转账成功！";
    statusEl.style.background = "#d4edda";

    // 更新余额
    await updateBalances();

  } catch (error) {
    console.error("转账失败:", error);
    statusEl.textContent = "转账失败";
    statusEl.style.background = "#f8d7da";
  }
});

// 切换到 Sepolia 网络
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
    });
  } catch (switchError) {
    // 如果网络不存在，添加网络
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }]
        });
      } catch (addError) {
        console.error('添加网络失败:', addError);
      }
    }
  }
}

// 初始化合约和UI
async function initContract(account) {
  try {
    console.log("初始化合约，账户:", account);
    
    // 确保 provider 已初始化
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    
    // 检查当前网络并选择合约
    const network = await provider.getNetwork();
    console.log("当前网络:", network);
    
    const networkName = SUPPORTED_NETWORKS[network.chainId] || `未知网络 (${network.chainId})`;
    
    if (network.chainId === 11155111) { // Sepolia
      currentContract = CONTRACTS.sepolia;
      console.log("使用 Sepolia 合约");
    } else if (network.chainId === 31337) { // 本地网络
      currentContract = CONTRACTS.localhost;
      console.log("使用本地合约");
    } else {
      // 不支持的网络，提供切换选项
      const shouldSwitch = confirm(
        `当前网络: ${networkName}\n\n` +
        `此 DApp 支持以下网络:\n` +
        `• Sepolia 测试网 (推荐)\n` +
        `• 本地开发网络\n\n` +
        `是否切换到 Sepolia 测试网？`
      );
      
      if (shouldSwitch) {
        statusEl.textContent = "正在切换网络...";
        statusEl.style.background = "#fff3cd";
        await switchToSepolia();
        return; // 网络切换后会触发 chainChanged 事件，重新加载页面
      } else {
        throw new Error(`不支持的网络: ${networkName}`);
      }
    }
    
    signer = provider.getSigner();
    contract = new ethers.Contract(currentContract.address, CONTRACT_ABI, signer);

    // 更新UI状态
    accountEl.textContent = account;
    statusEl.textContent = `已连接 ${currentContract.name}`;
    statusEl.style.background = "#d4edda";

    // 更新余额
    await updateBalances();

    // 启用按钮
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    transferBtn.disabled = false;
    
    console.log("合约初始化成功，地址:", currentContract.address);
    
  } catch (error) {
    console.error("初始化合约失败:", error);
    statusEl.textContent = `初始化失败: ${error.message}`;
    statusEl.style.background = "#f8d7da";
    
    // 重置按钮状态
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    transferBtn.disabled = true;
  }
}

// 重置UI
function resetUI() {
  accountEl.textContent = "--";
  ethBalanceEl.textContent = "--";
  contractBalanceEl.textContent = "--";
  statusEl.textContent = "未连接钱包";
  statusEl.style.background = "#f8f9fa";

  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  transferBtn.disabled = true;

  signer = null;
  contract = null;
}

// 更新账户和合约余额
async function updateBalances() {
  if (!provider || !contract) return;

  // 账户ETH余额
  const ethBalance = await provider.getBalance(await signer.getAddress());
  ethBalanceEl.textContent = ethers.utils.formatEther(ethBalance).substring(0, 10);

  // 合约ETH余额
  const contractBalance = await contract.getContractBalance();
  contractBalanceEl.textContent = ethers.utils.formatEther(contractBalance).substring(0, 10);
}