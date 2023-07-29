import { formatEther } from "viem";

type TArbProps = {
    dexIn: string,
    dexOut: string,
    value: bigint,
    profit: bigint,
    block: bigint,
  };
export const ArbEvent = ({dexIn, dexOut, value, profit, block}: TArbProps) => {
    return(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td>{Number(block)}</td>
            <td>{dexIn.slice(0,7)}</td>
            <td>{dexOut.slice(0,7)}</td>
            <td>{formatEther(value)} eth</td>
            <td>{formatEther(profit)} eth</td>
        </tr>
    )
};