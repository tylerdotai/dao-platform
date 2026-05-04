import { ethers } from "ethers";
import { buildGovernanceSyncPlan } from "./sync";

const ROB_RULES_ALLOWLIST_ABI = [
  "function addVoters(address[] calldata _voters) external",
  "function addVoter(address _voter) external",
  "function removeVoter(address _voter) external",
  "function isEligible(address _user) view returns (bool)",
  "function chair() view returns (address)",
  "function owner() view returns (address)",
];

function getBridgeConfig() {
  const rpcUrl =
    process.env.GOVERNANCE_RPC_URL ||
    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL ||
    process.env.ALCHEMY_RPC_URL;
  const contractAddress =
    process.env.GOVERNANCE_CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS;
  const signerKey = process.env.GOVERNANCE_SYNC_SIGNER_PRIVATE_KEY;

  if (!rpcUrl) throw new Error("Missing GOVERNANCE_RPC_URL");
  if (!contractAddress) throw new Error("Missing GOVERNANCE_CONTRACT_ADDRESS");
  if (!signerKey) throw new Error("Missing GOVERNANCE_SYNC_SIGNER_PRIVATE_KEY");

  return { rpcUrl, contractAddress, signerKey };
}

export async function executeGovernanceAllowlistSync() {
  const plan = await buildGovernanceSyncPlan();
  const wallets = [...new Set(plan.addVoters.map((entry) => entry.walletAddress).filter(Boolean))] as string[];

  if (wallets.length === 0) {
    return {
      mode: "execute" as const,
      executed: false,
      reason: "No eligible wallets to sync",
      plan,
    };
  }

  const { rpcUrl, contractAddress, signerKey } = getBridgeConfig();
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(signerKey, provider);
  const contract = new ethers.Contract(contractAddress, ROB_RULES_ALLOWLIST_ABI, signer);

  const tx = await contract.addVoters(wallets);
  const receipt = await tx.wait();

  return {
    mode: "execute" as const,
    executed: true,
    transactionHash: receipt?.hash || tx.hash,
    contractAddress,
    syncedWalletCount: wallets.length,
    syncedWallets: wallets,
    plan,
  };
}
