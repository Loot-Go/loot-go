import AppleMaps from "@/components/app/apple-maps";
import { CHAIN_LOOT_BOX } from "@/config/chain_loot_box";
import { getMapsToken } from "@/lib/globalActions";

export default async function Home() {
  const appleMapsToken = await getMapsToken();

  return (
    <div className="relative -mb-16 flex flex-1">
      <div className="absolute inset-0">
        <AppleMaps
          token={appleMapsToken}
          className="h-full w-full flex-1 bg-gray-300"
          coordinatesArray={[
            {
              lat: 13.721714,
              lng: 100.590783,
              type: "box1",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["chiliz-spicy"].lootgo,
            },
            {
              lat: 13.7150515,
              lng: 100.5596067,
              type: "box1",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["chiliz-spicy"].iwantswags,
            },
            {
              lat: 13.7333092,
              lng: 100.5597453,
              type: "box3",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["base-sepolia"].lootgo,
            },
            {
              lat: 13.7265141,
              lng: 100.5574144,
              type: "box1",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["base-sepolia"].iwantswags,
            },
            {
              lat: 13.7285516,
              lng: 100.5604224,
              type: "box1",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["base-sepolia"].iwantswags,
            },
            {
              lat: 13.720587,
              lng: 100.589821,
              type: "box2",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["flow-testnet"].lootgo,
            },
            {
              lat: 13.720803,
              lng: 100.59085,
              type: "box3",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["flow-testnet"].lootgo,
            },
            {
              lat: 13.721297,
              lng: 100.589829,
              type: "box2",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["celo-alfajores"].lootgo,
            },
            {
              lat: 13.7243611,
              lng: 100.5585,
              type: "box1",
              meme_coin: CHAIN_LOOT_BOX["mantle-sepolia"].iwantswags,
            },
            {
              lat: 13.7239,
              lng: 100.5589,
              type: "box3",
              meme_coin: CHAIN_LOOT_BOX["chiliz-spicy"].iwantswags,
            },
            {
              lat: 13.7243211,
              lng: 100.5565,
              type: "box2",
              disabled: true,
              meme_coin: CHAIN_LOOT_BOX["morph-testnet"].iwantswags,
            },
          ]}
          paddingBottom={70}
          enableUserLocation
        />
      </div>
    </div>
  );
}
