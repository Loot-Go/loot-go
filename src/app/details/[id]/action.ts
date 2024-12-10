"use server";

import {
  FusionOrder,
  FusionSDK,
  NetworkEnum,
  OrderParams,
  Web3Like,
  Web3ProviderConnector,
} from "@1inch/fusion-sdk";
import { ethers } from "ethers";

const DEV_PORTAL_API_TOKEN = process.env.NEXT_PUBLIC_1INCH_API_KEY!;

const signer = new ethers.JsonRpcProvider("https://mainnet.base.org", {
  chainId: NetworkEnum.COINBASE,
  name: "base",
});

const ethersProviderConnector: Web3Like = {
  eth: {
    call(transactionConfig): Promise<string> {
      return signer.call(transactionConfig);
    },
  },
  extend(): void {},
};
const connector = new Web3ProviderConnector(ethersProviderConnector);

const fusionSdk = new FusionSDK({
  url: "https://fusion.1inch.io",
  network: NetworkEnum.COINBASE,
  authKey: DEV_PORTAL_API_TOKEN,
  blockchainProvider: connector,
});

export const createOrder = async (params: OrderParams) => {
  try {
    // Create order params using SDK
    const orderParams = {
      fromTokenAddress: params.fromTokenAddress,
      toTokenAddress: params.toTokenAddress,
      amount: params.amount,
      walletAddress: params.walletAddress,
    };

    // Get order data using SDK
    const { order, hash, quoteId } = await fusionSdk.createOrder(orderParams);

    console.log("Order created:", order, hash, quoteId);

    return {
      order: JSON.parse(
        JSON.stringify(
          order,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
        ),
      ) as FusionOrder,
      hash,
      quoteId,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

export const submitOrder = async (
  order: FusionOrder,
  quoteId: string,
  signature: string,
) => {
  try {
    const result = await fusionSdk.submitOrder(order, quoteId);
    console.log("Order submitted:", result);
    return result;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw new Error("Error submitting order");
  }
};
