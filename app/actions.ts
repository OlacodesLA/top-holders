"use server";

import { ethers } from "ethers";

function truncateAddress(address: string): string {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export async function getTopHolders(contractAddress: string) {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  const apiUrl = `https://api.basescan.org/api`;

  const params = new URLSearchParams({
    module: "token",
    action: "tokenholderlist",
    contractaddress: contractAddress,
    page: "1",
    offset: "20",
    sort: "desc",
    apikey: apiKey!,
  });

  const response = await fetch(`${apiUrl}?${params}`);
  const data = await response.json();

  if (data.status !== "1") {
    throw new Error(data.message || "Failed to fetch token holders");
  }

  const holders = data.result.map((holder: any) => ({
    address: truncateAddress(holder.TokenHolderAddress),
    quantity: ethers.formatUnits(holder.TokenHolderQuantity, 18),
    percentage: (
      (Number.parseFloat(holder.TokenHolderQuantity) /
        Number.parseFloat(data.result[0].TokenHolderQuantity)) *
      100
    ).toFixed(2),
  }));

  return holders;
}
