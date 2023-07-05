import * as dotenv from "dotenv";
dotenv.config();
import { ethers, Wallet } from "ethers";
import balloonsAbi from "../deployments/localhost/Balloons.json";
import dexOneAbi from "../deployments/localhost/DexOne.json";
import dexTwoAbi from "../deployments/localhost/DexTwo.json";

// run to get typescript scripts to work npm install -g ts-node@latest

// set up script with a private key (needs eth)
// create contract instances to communicate to (need abi & address)
// loop creating random transactions to send each time
// max loop?
// log info?
async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    console.log("🚫️ You don't have a deployer account. Run `yarn generate` first");
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  // Get account from private key.
  const wallet = new Wallet(privateKey, provider);
  const address = wallet.address;

  console.log(address);

  const balloonsAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const dexOneAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const dexTwoAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const balloonsContract = new ethers.Contract(balloonsAddress, balloonsAbi.abi, wallet);

  const dexOneContract = new ethers.Contract(dexOneAddress, dexOneAbi.abi, wallet);

  const dexTwoContract = new ethers.Contract(dexTwoAddress, dexTwoAbi.abi, wallet);

  const addressBalance = await balloonsContract.balanceOf(address);
  console.log(ethers.utils.formatEther(addressBalance));

  await balloonsContract.approve(dexOneAddress, ethers.utils.parseEther("1000000"));
  await balloonsContract.approve(dexTwoAddress, ethers.utils.parseEther("1000000"));
  const txAmounts = ["0.1", "0.5", "1", "2", "5", "10", "20"];

  async function buildTx() {
    const amount = ethers.utils.parseEther(txAmounts[Math.floor(Math.random() * txAmounts.length)]);

    // need to calculate current slippage limits
    if (Math.random() > 0.5) {
      // Use DexOne
      const dexOneEthBalance = await provider.getBalance(dexOneAddress);
      const dexOneTokenBalance = await balloonsContract.balanceOf(dexOneAddress);
      if (Math.random() > 0.5) {
        // trade eth for tokens

        // expected return with 1% slip

        const minTokens = (await dexOneContract.price(amount, dexOneEthBalance, dexOneTokenBalance)).mul(99).div(100);
        console.log("trading eth 4 tokens dex one");
        console.log("amount", ethers.utils.formatEther(amount));
        console.log("tokensBack", ethers.utils.formatEther(minTokens));
        try {
          dexOneContract.ethToToken(minTokens, { value: amount });
        } catch {
          console.log("Slippage Error");
        }
      } else {
        // trade tokens for eth

        const minEth = (await dexOneContract.price(amount, dexOneTokenBalance, dexOneEthBalance)).mul(99).div(100);
        console.log("trading tokens 4 eth dex one");
        console.log("amount", ethers.utils.formatEther(amount));
        console.log("ethBack", ethers.utils.formatEther(minEth));
        try {
          tx = await dexOneContract.tokenToEth(amount, minEth);
        } catch {
          console.log("Slippage Error");
        }
      }
    } else {
      // use DexTwo
      const dexTwoEthBalance = await provider.getBalance(dexTwoAddress);
      const dexTwoTokenBalance = await balloonsContract.balanceOf(dexTwoAddress);
      if (Math.random() > 0.5) {
        // trade eth for tokens

        const minTokens = (await dexTwoContract.price(amount, dexTwoEthBalance, dexTwoTokenBalance)).mul(99).div(100);
        console.log("trading eth 4 tokens dex two");
        console.log("amount", ethers.utils.formatEther(amount));
        console.log("tokensBack", ethers.utils.formatEther(minTokens));
        try {
          tx = await dexTwoContract.ethToToken(minTokens, { value: amount });
        } catch {
          console.log("Slippage Error");
        }
      } else {
        // trade tokens for eth

        const minEth = (await dexTwoContract.price(amount, dexTwoTokenBalance, dexTwoEthBalance)).mul(99).div(100);
        console.log("trading tokens 4 eth dex two");
        console.log("amount", ethers.utils.formatEther(amount));
        console.log("ethBack", ethers.utils.formatEther(minEth));
        try {
          dexTwoContract.tokenToEth(amount, minEth);
        } catch {
          console.log("Slippage Fail");
        }
      }
    }
  }
  // creates 100 txs, 1 every 2 seconds
  let x = 0;
  setInterval(() => {
    if (x < 100) {
      buildTx();
    }
  }, 2000);
  x++;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
