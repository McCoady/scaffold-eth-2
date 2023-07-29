# MEV Sandpit 101 ⛱

This repo is a fun challenge to flex your scripting skills to profit from dex arbitrage.
The repo is made up of a 3 smart contracts & one ethers script built on top of scaffold-eth 2.

## 3 Smart Contracts
- A Simple ERC20 Implementation.
- Two Basic Decentralised exchange contracts that trade the ERC20 token for ETH. These contracts are based on the speedrunethereum MVP Dexes with a slippage protection option added.

## 1 Ethers Script
- The ethers script adds a random transaction, in a random direction, to one of the two dexes each block. This is to roughly mimmick a 'live' network environment.

## The Challenge

The goal of this repo is to create a script that can most efficiently profit from this network via arbitrage (or other methods). You can use both smart contracts & ethers scripts when creating your bot.

## Running the environment

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- ts-node (yarn add -g ts-node)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the bases contracts (ERC20, and two dex contracts):

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal:

```
cd packages/hardhat
ts-node spoofTxs.ts
```

This will start the activity between the dexes, you should see logs in the console of the trades as they're made.

5. on a fourth terminal:

```
yarn start
```
Then head over the the example-ui and you should see some dex transactions events being picked up by the front end, as well as the current eth price of 1 $BAL across the two dexes.

From here you're ready to start building your bot!
When you're ready to deploy uncomment the section to deploy ArbBot (ln57-61) in `00_deploy_your_contract.ts` and rerun yarn deploy
Then in a new terminal run 
```
cd packages/hardhat
ts-node arbBot.ts
```
And you should be set!
Then you can follow your bots successful arbs on the frontend.