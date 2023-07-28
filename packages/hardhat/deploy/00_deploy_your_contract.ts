import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

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

  // deploy credit token
  const creditToken = await deploy("CreditToken", {
    from: deployer,
    args: ["Buidl Dollars", "BUIDL", deployer],
    log: true,
    autoMine: true,
  });
  // deploy wood token
  const woodToken = await deploy("AssetToken", {
    from: deployer,
    args: ["Wood", "WOOD"],
    log: true,
    autoMine: true,
  });
  // deploy oil token
  const oilToken = await deploy("AssetToken", {
    from: deployer,
    args: ["Oil", "OIL"],
    log: true,
    autoMine: true,
  });
  // deploy water token
  const waterToken = await deploy("AssetToken", {
    from: deployer,
    args: ["Water", "WTR"],
    log: true,
    autoMine: true,
  });
  // deploy gold token
  const goldToken = await deploy("AssetToken", {
    from: deployer,
    args: ["Gold", "GLD"],
    log: true,
    autoMine: true,
  });
  // deploy stone token
  const stoneToken = await deploy("AssetToken", {
    from: deployer,
    args: ["Stone", "STN"],
    log: true,
    autoMine: true,
  });

  // deploy dexes
  // deploy credit-wood dex
  await deploy("BasicDex", {
    from: deployer,
    args: [creditToken.address, woodToken.address],
    log: true,
    autoMine: true,
  });
  // deploy credit-oil dex
  await deploy("BasicDex", {
    from: deployer,
    args: [creditToken.address, oilToken.address],
    log: true,
    autoMine: true,
  });
  // deploy credit-water dex
  await deploy("BasicDex", {
    from: deployer,
    args: [creditToken.address, waterToken.address],
    log: true,
    autoMine: true,
  });
  // deploy credit-gold dex
 await deploy("BasicDex", {
    from: deployer,
    args: [creditToken.address, goldToken.address],
    log: true,
    autoMine: true,
  });
  // deploy credit-stone dex
  await deploy("BasicDex", {
    from: deployer,
    args: [creditToken.address, stoneToken.address],
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
