/*
 * Meme tokens deployed on different chains
 * Token Symbol: LOOTGO, IWANTSWAGS
 */

export interface ChainLootBox {
  lootgo: string;
  iwantswags: string;
}

export const CHAIN_LOOT_BOX: Record<string, ChainLootBox> = {
  "chiliz-spicy": {
    lootgo: "0x7CC3922213136A7Ce8467eCB02FdF4135D5d400F",
    iwantswags: "0xe77C75Ec925b36A3F2AF8a1fc62769e5ef8201cA",
  },
  "base-sepolia": {
    lootgo: "0xabC5AA8BAce91c9c0B641Cb1331Ea5C2824C8CB5",
    iwantswags: "0x432429b2f402f2aE3846925C2a247473C15622a1",
  },
  "flow-testnet": {
    lootgo: "0xe77C75Ec925b36A3F2AF8a1fc62769e5ef8201cA",
    iwantswags: "0x7CC3922213136A7Ce8467eCB02FdF4135D5d400F",
  },
  "celo-alfajores": {
    lootgo: "0x7CC3922213136A7Ce8467eCB02FdF4135D5d400F",
    iwantswags: "0xe77C75Ec925b36A3F2AF8a1fc62769e5ef8201cA",
  },
  "mantle-sepolia": {
    lootgo: "0x7CC3922213136A7Ce8467eCB02FdF4135D5d400F",
    iwantswags: "0xe77C75Ec925b36A3F2AF8a1fc62769e5ef8201cA",
  },
  "morph-testnet": {
    lootgo: "0x8D914ED98f39B29522eC5098f525E9122a337d0f",
    iwantswags: "0xf70833c5E6C646E6428337b547518169C4D5Cb81",
  },
};
