import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
dotenv.config();

let accounts;
accounts = {
  mnemonic: process.env.MNEMONIC,
};

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "london",
      accounts,
      allowUnlimitedContractSize: false,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts,
    },
    Sepolia: {
      url: process.env.ROPSTEN_URL || "",
      accounts,
    },
  },
};

export default config;
