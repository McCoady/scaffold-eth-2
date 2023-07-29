import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractData } from "~~/components/example-ui/ContractData";
import { DexOneInfo } from "~~/components/example-ui/DexOneInfo";
import { DexTwoInfo } from "~~/components/example-ui/DexTwoInfo";

const ExampleUI: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow p-3" data-theme="exampleUi">
        <div className="pr-3">
          <div className="font-bold pb-2">Recent Dex Activity</div>
          <DexOneInfo />
          <DexTwoInfo />
        </div>
        <ContractData />
      </div>
    </>
  );
};

export default ExampleUI;
