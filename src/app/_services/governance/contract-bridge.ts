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
  const expectedChainId = process.env.GOVERNANCE_EXPECTED_CHAIN_ID
    ? Number(process.env.GOVERNANCE_EXPECTED_CHAIN_ID)
    : null;
  const writesEnabled = process.env.GOVERNANCE_ENABLE_SYNC_WRITES === "true";

  if (!rpcUrl) throw new Error("Missing GOVERNANCE_RPC_URL");
  if (!contractAddress) throw new Error("Missing GOVERNANCE_CONTRACT_ADDRESS");
  if (!signerKey) throw new Error("Missing GOVERNANCE_SYNC_SIGNER_PRIVATE_KEY");
  if (!ethers.isAddress(contractAddress)) {
    throw new Error("Invalid GOVERNANCE_CONTRACT_ADDRESS");
  }

  return {
    rpcUrl,
    contractAddress,
    signerKey,
    expectedChainId,
    writesEnabled,
  };
}

function sanitizeWallets(wallets: (string | null | undefined)[]) {
  return [...new Set(wallets.filter(Boolean))].filter((wallet): wallet is string => {
    try {
      return ethers.isAddress(wallet);
    } catch {
      return false;
    }
  });
}

export async function executeGovernanceAllowlistSync() {
  const plan = await buildGovernanceSyncPlan();
  const requestedWallets = sanitizeWallets(
    plan.addVoters.map((entry) => entry.walletAddress),
  );

  const { rpcUrl, contractAddress, signerKey, expectedChainId, writesEnabled } =
    getBridgeConfig();

  if (!writesEnabled) {
    return {
      mode: "execute" as const,
      executed: false,
      reason: "GOVERNANCE_ENABLE_SYNC_WRITES is not enabled",
      plan,
      requestedWalletCount: requestedWallets.length,
    };
  }

  if (requestedWallets.length === 0) {
    return {
      mode: "execute" as const,
      executed: false,
      reason: "No eligible wallets to sync",
      plan,
      requestedWalletCount: 0,
    };
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  if (expectedChainId !== null && Number(network.chainId) !== expectedChainId) {
    throw new Error(
      `Wrong chain. Expected ${expectedChainId}, got ${network.chainId.toString()}`,
    );
  }

  const signer = new ethers.Wallet(signerKey, provider);
  const contract = new ethers.Contract(contractAddress, ROB_RULES_ALLOWLIST_ABI, signer);

  const existingFlags = await Promise.all(
    requestedWallets.map(async (wallet) => ({
      wallet,
      alreadyEligible: Boolean(await contract.isEligible(wallet)),
    })),
  );

  const walletsToAdd = existingFlags
    .filter((entry) => !entry.alreadyEligible)
    .map((entry) => entry.wallet);

  if (walletsToAdd.length === 0) {
    return {
      mode: "execute" as const,
      executed: false,
      reason: "All eligible wallets are already present onchain",
      plan,
      requestedWalletCount: requestedWallets.length,
      skippedWalletCount: existingFlags.length,
    };
  }

  const tx = await contract.addVoters(walletsToAdd);
  const receipt = await tx.wait();

  return {
    mode: "execute" as const,
    executed: true,
    transactionHash: receipt?.hash || tx.hash,
    contractAddress,
    chainId: Number(network.chainId),
    requestedWalletCount: requestedWallets.length,
    syncedWalletCount: walletsToAdd.length,
    skippedWalletCount: existingFlags.length - walletsToAdd.length,
    syncedWallets: walletsToAdd,
    plan,
  };
}
