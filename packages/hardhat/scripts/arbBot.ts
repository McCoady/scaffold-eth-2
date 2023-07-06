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
  // Get account from private key.
  const wallet = new Wallet(privateKey, provider);

  const balloonsAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const dexOneAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const dexTwoAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const arbBotAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const balloonsContract = new ethers.Contract(balloonsAddress, balloonsAbi.abi, wallet);

  const dexOneContract = new ethers.Contract(dexOneAddress, dexOneAbi.abi, wallet);

  const dexTwoContract = new ethers.Contract(dexTwoAddress, dexTwoAbi.abi, wallet);

  const arbBotContract = new ethers.Contract(arbBotAddress, arbBotAbi.abi, wallet);

  console.log("Eth sent to Arb bot", ethers.utils.formatEther(await arbBotContract.totalEthIn()));
  console.log("Arb bot funds", ethers.utils.formatEther(await provider.getBalance(arbBotAddress)));
  async function doArb() {
    // 1: Keep track of prices of each token
    const dexOneEthBalance = await provider.getBalance(dexOneAddress);
    const dexOneTokenBalance = await balloonsContract.balanceOf(dexOneAddress);
    const dexTwoEthBalance = await provider.getBalance(dexTwoAddress);
    const dexTwoTokenBalance = await balloonsContract.balanceOf(dexTwoAddress);

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
    console.log(
      `Dex One Price ${ethers.utils.formatEther(dexOneEthPrice)}. Dex Two Price ${ethers.utils.formatEther(
        dexTwoEthPrice,
      )}`,
    );

    const cheapest = dexOneEthPrice > dexTwoEthPrice ? 0 : 1;

    if (cheapest === 0) {
      try {
        await arbBotContract.tryArb(dexTwoAddress, dexOneAddress, {
          value: ethers.utils.parseEther("2.5"),
          maxPriorityFeePerGas: "2",
        });
        const ethToBot = ethers.utils.formatEther(await arbBotContract.totalEthIn());
        const ethInBot = ethers.utils.formatEther(await provider.getBalance(arbBotAddress));
        console.log(`Eth sent to bot: ${ethToBot}, Eth current in bot: ${ethInBot}`);
        console.log("---");
      } catch {
        console.log("No arb this block");
      }
    } else {
      try {
        await arbBotContract.tryArb(dexOneAddress, dexTwoAddress, {
          value: ethers.utils.parseEther("2.5"),
          maxPriorityFeePerGas: "2",
        });
      } catch {
        console.log("No arb this block");
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
