import { createMint, getMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
// 加载环境变量
dotenv.config();

function base58ToKeypair(base58PrivateKey: string): Keypair {
    try {
        const privateKeyBuffer = bs58.decode(base58PrivateKey);
        return Keypair.fromSecretKey(privateKeyBuffer);
    } catch (error) {
        throw new Error("Invalid base58 private key.");
    }
}

async function main() {
    const connection = new Connection(clusterApiUrl("devnet"));

    let base58PrivateKey = process.env.PRIV_KEY;
    if (!base58PrivateKey) {
        throw new Error("未设置私钥");
    }
    const payer = base58ToKeypair(base58PrivateKey);

    console.log("开始创建token mint");
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        payer.publicKey,
        9,
        undefined,
        { commitment: connection.commitment },
        TOKEN_PROGRAM_ID
    );
    console.log("token mint创建成功, mint: ", mint);

    console.log("开始获取 token mint的信息");
    const mintInfo = await getMint(
        connection,
        mint,
        connection.commitment,
        TOKEN_PROGRAM_ID
    );
    console.log("token mint的信息:", mintInfo);
}

main()
    .then()
    .catch((e) => {
        console.log(e);
    });
