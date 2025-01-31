"use client";

import { useState } from "react";
import { getTopHolders } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Holder {
  address: string;
  quantity: string;
  percentage: string;
}

export default function TopHolders() {
  const [contractAddress, setContractAddress] = useState("");
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await getTopHolders(contractAddress);
      setHolders(data);
    } catch {
      setError(
        "Failed to fetch holders. Please check the contract address and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-100">
          Holder distribution
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter ERC20 Token Contract Address"
          className="bg-[#25262b] border-gray-700 text-gray-100 placeholder:text-gray-500"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Fetching holders..." : "Fetch Top Holders"}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {holders.length > 0 && (
        <div className="space-y-2">
          {holders.map((holder, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#25262b] rounded-lg hover:bg-[#2c2d32] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">{index + 1}.</span>
                <span className="font-mono text-sm">{holder.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-1 bg-blue-600/20 rounded-full"
                  style={{
                    width: `${Math.max(
                      20,
                      Number.parseFloat(holder.percentage) * 2
                    )}px`,
                  }}
                />
                <span className="text-sm text-gray-400">
                  {holder.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
