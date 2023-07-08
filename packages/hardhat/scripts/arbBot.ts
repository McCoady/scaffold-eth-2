import * as dotenv from "dotenv";
dotenv.config();
// Uncomment these for some help setting up some of the fiddly bits 😛
// import { ethers, Wallet } from "ethers";
// import balloonsAbi from "../deployments/localhost/Balloons.json";
// import dexOneAbi from "../deployments/localhost/DexOne.json";
// import dexTwoAbi from "../deployments/localhost/DexTwo.json";
// import arbBotAbi from "../deployments/localhost/ArbBot.json";

async function main() {
  // More helpers, uncomment to use 😁
  // const privateKey = process.env.ARB_PRIVATE_KEY;

  // if (!privateKey) {
  //   console.log("🚫️ You don't have a deployer account. Run `yarn generate` first");
  //   return;
  // }

  // // make sure this connects to your localhost chain
  // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // // set up wallet that will sign transactions for the script
  // const wallet = new Wallet(privateKey, provider);

  // // get the addresses of our contracts & initialize ethers Contracts
  // const balloonsAddress = balloonsAbi.address;
  // const dexOneAddress = dexOneAbi.address;
  // const dexTwoAddress = dexTwoAbi.address;

  // const balloonsContract = new ethers.Contract(balloonsAddress, balloonsAbi.abi, wallet);
  // const dexOneContract = new ethers.Contract(dexOneAddress, dexOneAbi.abi, wallet);
  // const dexTwoContract = new ethers.Contract(dexTwoAddress, dexTwoAbi.abi, wallet);

  // // get address & init contract for your bot contract
  // const arbBotAddress = arbBotAbi.address;
  // const arbBotContract = new ethers.Contract(arbBotAddress, arbBotAbi.abi, wallet);

  async function doArb() {
    // 1: Keep track of prices of each token
    // 2: Log the current prices in the terminal
    // 3: Attempt Arb
    // 4: Log results
  }

  // Call doArb every 4 seconds
  let x = 0;
  setInterval(() => {
    if (x < 100) {
      doArb();
    }
  }, 4000);
  x++;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
