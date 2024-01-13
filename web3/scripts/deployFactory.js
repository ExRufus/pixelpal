const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const CommissionFactory = await ethers.getContractFactory("CommissionFactory");
  const commissionFactory = await CommissionFactory.deploy();

  console.log("CommissionFactory deployed to:", commissionFactory.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
