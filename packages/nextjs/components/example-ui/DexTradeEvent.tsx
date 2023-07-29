import { formatEther } from "viem";

type TDexTradeProps = {
  amountIn: bigint;
  amountOut: bigint;
  block: bigint;
};
export const DexTradeEvent = ({ amountIn, amountOut, block }: TDexTradeProps) => {
  return(
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td>{Number(block)}</td>
      <td>{formatEther(amountIn)}</td>
      <td>{formatEther(amountOut)}</td>
    </tr>
  )
};
