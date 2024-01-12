const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const ArtCommissionContract = await ethers.getContractFactory("ArtCommissionContract");
  const artCommissionContract = await ArtCommissionContract.deploy();

  console.log("ArtCommissionContract deployed to:", artCommissionContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
