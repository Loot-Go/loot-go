"use server";

import {
  FusionSDK,
  NetworkEnum,
  OrderStatus,
  PrivateKeyProviderConnector,
  Web3Like,
} from "@1inch/fusion-sdk";
import { Contract, ethers, JsonRpcProvider, Wallet } from "ethers";

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const NODE_URL = "https://mainnet.base.org";
const DEV_PORTAL_API_TOKEN = process.env.NEXT_PUBLIC_1INCH_API_KEY;

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
];

const ethersRpcProvider = new JsonRpcProvider(NODE_URL);

const ethersProviderConnector: Web3Like = {
  eth: {
    call(transactionConfig): Promise<string> {
      return ethersRpcProvider.call(transactionConfig);
    },
  },
  extend(): void {},
};

const connector = new PrivateKeyProviderConnector(
  PRIVATE_KEY,
  ethersProviderConnector,
);

const sdk = new FusionSDK({
  url: "https://api.1inch.dev/fusion",
  network: NetworkEnum.COINBASE,
  blockchainProvider: connector,
  authKey: DEV_PORTAL_API_TOKEN,
});

export async function swap1INCH() {
  const wallet = new Wallet(PRIVATE_KEY.toString().trim());

  const params = {
    fromTokenAddress: "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE", // 1inch
    toTokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
    amount: "1000000000000000000", // 1 1inch
    walletAddress: wallet.address,
    source: "sdk-test",
  };

  const provider = new ethers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const preparedOrder = await sdk.createOrder(params);

  console.log("Order created", preparedOrder);

  try {
    const fusionSettlementContract = preparedOrder.order
      .settlementExtensionContract as unknown as { val: string };
    const fusionSettlementContractAddress = fusionSettlementContract.val;

    const tokenContract = new Contract(
      "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE",
      ERC20_ABI,
      signer,
    );

    const currentAllowance = await tokenContract.allowance(
      signer.address,
      fusionSettlementContractAddress,
    );

    if (currentAllowance < preparedOrder.order.makingAmount) {
      const tx = await tokenContract.approve(
        fusionSettlementContractAddress,
        ethers.MaxUint256,
      );
      await tx.wait();
    }

    const info = await sdk.submitOrder(
      preparedOrder.order,
      preparedOrder.quoteId,
    );

    console.log("OrderHash", info.orderHash);

    return info.orderHash;
  } catch (e) {
    console.log(e);
    throw new Error("Error submitting order");
  }
}

export async function swapUSDC() {
  const wallet = new Wallet(PRIVATE_KEY.toString().trim());

  const params = {
    fromTokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
    toTokenAddress: "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE", // 1inch
    amount: "100000", // 0.1 USDC
    walletAddress: wallet.address,
    source: "sdk-test",
  };

  const provider = new ethers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const preparedOrder = await sdk.createOrder(params);

  console.log("Order created", preparedOrder);

  try {
    const fusionSettlementContract = preparedOrder.order
      .settlementExtensionContract as unknown as { val: string };
    const fusionSettlementContractAddress = fusionSettlementContract.val;

    const tokenContract = new Contract(
      "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      ERC20_ABI,
      signer,
    );

    const currentAllowance = await tokenContract.allowance(
      signer.address,
      fusionSettlementContractAddress,
    );

    if (currentAllowance < preparedOrder.order.makingAmount) {
      const tx = await tokenContract.approve(
        fusionSettlementContractAddress,
        ethers.MaxUint256,
      );
      await tx.wait();
    }

    const info = await sdk.submitOrder(
      preparedOrder.order,
      preparedOrder.quoteId,
    );

    console.log("OrderHash", info.orderHash);

    return info.orderHash;
  } catch (e) {
    console.log(e);
    throw new Error("Error submitting order");
  }
}

export async function getOrderStatus(orderHash: string) {
  while (true) {
    try {
      const data = await sdk.getOrderStatus(orderHash);

      if (data.status === OrderStatus.Filled) {
        console.log("fills", data.fills);
        return {
          status: data.status,
          fills: data.fills,
        };
      }

      if (data.status === OrderStatus.Expired) {
        console.log("Order Expired");
        return {
          status: data.status,
          fills: data.fills,
        };
      }

      if (data.status === OrderStatus.Cancelled) {
        console.log("Order Cancelled");

        return {
          status: data.status,
          fills: data.fills,
        };
      }
    } catch (e) {
      console.log(e);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
