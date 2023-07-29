import { ArbEvent } from "./ArbEvent";
import { formatEther } from "viem";
import {  useBalance } from "wagmi";
import {
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldEventHistory,
} from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const ContractData = () => {
  const configuredNetwork = getTargetNetwork();
  const { data: totalEthIn } = useScaffoldContractRead({
    contractName: "ArbBot",
    functionName: "totalEthIn",
  });
  const { data: arbBot } = useScaffoldContract({ contractName: "ArbBot" });

  let profit;

  const { data: botEth } = useBalance({
    address: arbBot?.address,
    chainId: getTargetNetwork().id,
  });
  if (totalEthIn != undefined && botEth != undefined) {
    profit = formatEther(botEth.value - totalEthIn);
  }

  const {
    data: arbChangeEvents,
  } = useScaffoldEventHistory({
    contractName: "ArbBot",
    eventName: "Arb",
    fromBlock: BigInt(0),
    blockData: true,
  });

  return (
    <>
      <div>
        <div className="flex flex-row">
          <div className="font-bold">Current Bot Profit:</div>
          <div className="font-bold pl-3">{profit}</div>
          <span className="text-[0.7em] font-bold pt-1 pl-1">{configuredNetwork.nativeCurrency.symbol}</span>
        </div>

        <div className="pt-2">Most Recent Arbs</div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th>Block No</th>
              <th>Dex In</th>
              <th>Dex Out</th>
              <th>Value</th>
              <th>Profit</th>
            </tr>
          </thead>
          {arbChangeEvents?.slice(0, 5).map(arb => (
            <ArbEvent
              dexIn={arb.args.dexFrom}
              dexOut={arb.args.dexTo}
              value={arb.args.value}
              profit={arb.args.profit}
              block={arb.block.number}
              key={Math.random()}
            />
          ))}
        </table>
      </div>
    </>
  );
};
