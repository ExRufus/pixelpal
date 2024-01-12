require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/a41c4ae2c4514d3c8313f85fa08a4391`,
      accounts: [`0212a0e19feaebc367e2de523983a347584ba24aded18748e0007021216925c3`],
    }
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },  
};
