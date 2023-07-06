import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Balloons", {
    from: deployer,
    // Contract constructor arguments
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const balloons = await hre.ethers.getContract("Balloons", deployer);

  await deploy("DexOne", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [balloons.address],
    log: true,
    autoMine: true,
  });

  const dexOne = await hre.ethers.getContract("DexOne", deployer);

  await deploy("DexTwo", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [balloons.address],
    log: true,
    autoMine: true,
  });

  const dexTwo = await hre.ethers.getContract("DexTwo", deployer);

  // await deploy("ArbBot", {
  //   from: deployer,
  //   log: true,
  //   autoMine: true,
  // });

  console.log("Approving DEX one (" + dexOne.address + ") to take Balloons from main account...");
  // If you are going to the testnet make sure your deployer account has enough ETH
  await balloons.approve(dexOne.address, ethers.utils.parseEther("2000"));
  console.log("INIT exchange one...");
  await dexOne.init(ethers.utils.parseEther("2000"), {
    value: ethers.utils.parseEther("2000"),
    gasLimit: 250000,
  });

  console.log("Approving DEX two (" + dexTwo.address + ") to take Balloons from main account...");
  // If you are going to the testnet make sure your deployer account has enough ETH
  await balloons.approve(dexTwo.address, ethers.utils.parseEther("2000"));
  console.log("INIT exchange two...");
  await dexTwo.init(ethers.utils.parseEther("2000"), {
    value: ethers.utils.parseEther("2000"),
    gasLimit: 250000,
  });

  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["Balloons", "Dex"];
