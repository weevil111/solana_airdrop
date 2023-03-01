const SOLANA = require("@solana/web3.js");
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;
const SOLANA_CONNECTION = new Connection(clusterApiUrl("devnet"));
const WALLET_ADDRESS = "YOUR_PHANTOM_WALLET_ADDRESS"; //👈 Replace with your wallet address

export async function POST(request) {
  try {
    const body = await request.json();
    const { pubkey, amount = 1 } = body;
    const AIRDROP_AMOUNT = amount * LAMPORTS_PER_SOL; // 1 SOL

    if (!pubkey) {
      return Response.json(
        { success: false, message: "No public key found" },
        { status: 404 }
      );
    }

    const signature = await SOLANA_CONNECTION.requestAirdrop(
      new PublicKey(pubkey),
      AIRDROP_AMOUNT
    );
    const { blockhash, lastValidBlockHeight } =
      await SOLANA_CONNECTION.getLatestBlockhash();
    await SOLANA_CONNECTION.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature,
      },
      "finalized"
    );
    return Response.json({
      success: true,
      message: `Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      success: false,
      message: "Somwthing went wrong! Please try again",
    });
  }
}
