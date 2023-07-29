import * as dotenv from "dotenv";
dotenv.config();
import { ethers, Wallet } from "ethers";
import balloonsAbi from "../deployments/localhost/Balloons.json";
import dexOneAbi from "../deployments/localhost/DexOne.json";
import dexTwoAbi from "../deployments/localhost/DexTwo.json";
import arbBotAbi from "../deployments/localhost/ArbBot.json";

async function main() {
  const privateKey = process.env.ARB_PRIVATE_KEY;

  if (!privateKey) {
    console.log("🚫️ You don't have a deployer account. Run `yarn generate` first");
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // set up wallet that will sign transactions for the script
  const wallet = new Wallet(privateKey, provider);

  // get the addresses of our contracts & initialize ethers Contracts
  const balloonsAddress = balloonsAbi.address;
  const dexOneAddress = dexOneAbi.address;
  const dexTwoAddress = dexTwoAbi.address;

  const balloonsContract = new ethers.Contract(balloonsAddress, balloonsAbi.abi, wallet);
  const dexOneContract = new ethers.Contract(dexOneAddress, dexOneAbi.abi, wallet);
  const dexTwoContract = new ethers.Contract(dexTwoAddress, dexTwoAbi.abi, wallet);

  // get address & init contract for our bot contract
  const arbBotAddress = arbBotAbi.address;
  const arbBotContract = new ethers.Contract(arbBotAddress, arbBotAbi.abi, wallet);

  // log the initial state of bot contract when script starts
  console.log("Eth sent to Arb bot", ethers.utils.formatEther(await arbBotContract.totalEthIn()));
  console.log("Arb bot funds", ethers.utils.formatEther(await provider.getBalance(arbBotAddress)));

  // function that attempts the arbitrage
  async function doArb() {
    const txSize = "5";
    // 1: Keep track of prices of each token

    // calculate dex reserves arguments
    const dexOneEthBalance = await provider.getBalance(dexOneAddress);
    const dexOneTokenBalance = await balloonsContract.balanceOf(dexOneAddress);
    const dexTwoEthBalance = await provider.getBalance(dexTwoAddress);
    const dexTwoTokenBalance = await balloonsContract.balanceOf(dexTwoAddress);

    // call price on the two dex contracts
    const dexOneEthPrice = await dexOneContract.price(
      ethers.utils.parseEther("1"),
      dexOneEthBalance,
      dexOneTokenBalance,
    );
    const dexTwoEthPrice = await dexTwoContract.price(
      ethers.utils.parseEther("1"),
      dexTwoEthBalance,
      dexTwoTokenBalance,
    );

    // log the current prices in the terminal
    console.log(
      `Dex One Price ${ethers.utils.formatEther(dexOneEthPrice)}. Dex Two Price ${ethers.utils.formatEther(
        dexTwoEthPrice,
      )}`,
    );

    // if dex one more expensive than dex two try arb dex two, else try arb dex one
    if (dexOneEthPrice > dexTwoEthPrice) {
      try {
        await arbBotContract.tryArb(dexTwoAddress, dexOneAddress, {
          value: ethers.utils.parseEther(txSize),
          maxPriorityFeePerGas: "2",
        });
        const ethToBot = ethers.utils.formatEther(await arbBotContract.totalEthIn());
        const ethInBot = ethers.utils.formatEther(await provider.getBalance(arbBotAddress));
        console.log(`Eth sent to bot: ${ethToBot}, Eth current in bot: ${ethInBot}`);
        console.log("---");
      } catch {
        console.log("No arb this block");
        console.log("---");
      }
    } else {
      try {
        await arbBotContract.tryArb(dexOneAddress, dexTwoAddress, {
          value: ethers.utils.parseEther(txSize),
          maxPriorityFeePerGas: "2",
        });
      } catch {
        console.log("No arb this block");
        console.log("---");
      }
    }
  }

  // creates 100 txs, 1 every 2 seconds
  let x = 0;
  setInterval(() => {
    if (x < 10) {
      doArb();
    }
  }, 4000);
  x++;
}

// work out current price, find cheapest, work out

// calc eth/token (dexOne) vs eth/token (dexTwo), then trade ~ 45% of the difference?
// If prices are different across two dexes, buy balloons from cheaper dex, sell to more expenisve one
// 2: Work out how much can be bought to balance the price (and make maximum profit)
// Only deal with buying and selling the ERC20 token in the same tx, so profits are all in Eth
// 3: Set high gas/prio to make sure you get into the block early
// 3: Log new Eth balance after each Tx

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});