// import * as dotenv from "dotenv";
// dotenv.config();
// import { ethers, Wallet } from "ethers";
// import balloonsAbi from "../deployments/localhost/Balloons.json";
// import dexOneAbi from "../deployments/localhost/DexOne.json";
// import dexTwoAbi from "../deployments/localhost/DexTwo.json";

// // script sets a target price for an ERC token and trades to keep it at that price
// async function main() {
//     const privateKey = process.env.ARB_PRIVATE_KEY;

//     if (!privateKey) {
//       console.log("🚫️ You don't have a deployer account. Run `yarn generate` first");
//       return;
//     }

//     const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
//     // Get account from private key.
//     const wallet = new Wallet(privateKey, provider);
//     const address = wallet.address;

//     console.log(address);

//     const balloonsAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//     const dexOneAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
//     const dexTwoAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//     const balloonsContract = new ethers.Contract(balloonsAddress, balloonsAbi.abi, wallet);

//     const dexOneContract = new ethers.Contract(dexOneAddress, dexOneAbi.abi, wallet);

//     const dexTwoContract = new ethers.Contract(dexTwoAddress, dexTwoAbi.abi, wallet);

// }

// main().catch(error => {
//     console.error(error);
//     process.exitCode = 1;
//   });
