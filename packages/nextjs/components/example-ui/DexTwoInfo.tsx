import { DexTradeEvent } from "./DexTradeEvent";
import { formatEther, parseEther } from "viem";
import { useBalance } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const DexTwoInfo = () => {
  const { data: dex } = useScaffoldContract({ contractName: "DexTwo" });

  const { data: balance } = useBalance({
    address: dex?.address,
    chainId: getTargetNetwork().id,
  });
  const { data: tokenBalance } = useScaffoldContractRead({
    contractName: "Balloons",
    functionName: "balanceOf",
    args: [dex?.address],
  });

  const { data: currentPrice } = useScaffoldContractRead({
    contractName: "DexTwo",
    functionName: "price",
    args: [parseEther("1"), balance?.value, tokenBalance],
  });

  let price = currentPrice != undefined ? currentPrice : BigInt(0);

  const { data: ethTradeEvents } = useScaffoldEventHistory({
    contractName: "DexTwo",
    eventName: "EthToTokenSwap",
    fromBlock: BigInt(0),
    blockData: true,
  });
  const { data: tokenTradeEvents } = useScaffoldEventHistory({
    contractName: "DexTwo",
    eventName: "TokenToEthSwap",
    fromBlock: BigInt(0),
    blockData: true,
  });

  return (
    <>
      <div className="font-bold pt-8">Current Price Dex Two: {formatEther(price)}</div>
      <div className="pt-2">Eth To Token Trades</div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Block No</th>
            <th>Eth in</th>
            <th>Tokens out</th>
          </tr>
        </thead>
        <tbody>
          {ethTradeEvents?.slice(0, 5).map(trade => (
            <DexTradeEvent
              amountIn={trade.args._ethSwapped}
              amountOut={trade.args._tokensReceived}
              block={trade.block.number}
              key={Math.random()}
            />
          ))}
        </tbody>
      </table>
      <div className="pt-2">Token To Eth Trades</div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Block No</th>
            <th>Tokens in</th>
            <th>Eth out</th>
          </tr>
        </thead>
        <tbody>
          {tokenTradeEvents?.slice(0, 5).map(trade => (
            <DexTradeEvent
              amountIn={trade.args._tokensSwapped}
              amountOut={trade.args._ethReceived}
              block={trade.block.number}
              key={Math.random()}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
