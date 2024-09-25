import {
    createInitializeMint2Instruction,
    createMint,
    getMinimumBalanceForRentExemptMint,
    getMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
    clusterApiUrl,
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
// import { generateVanityAddress } from "vanity-solana";
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

/**
 * 生成虚荣地址
 * @param prefix 前缀
 * @param suffix 后缀
 * @param caseSensitive  是否大小写敏感
 * @returns  计算100万次
 */
async function generateVanityAddress(
    prefix: string,
    suffix: string
): Promise<Keypair | undefined> {
    for (let i = 0; i < 1000000; i++) {
        const keypair = Keypair.generate();

        const address = keypair.publicKey.toBase58();
        // 检查是否满足要求
        if (address.startsWith(prefix) && address.endsWith(suffix)) {
            return keypair;
        }
    }
}

async function main() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    let base58PrivateKey = process.env.PRIV_KEY;
    if (!base58PrivateKey) {
        throw new Error("未设置私钥");
    }
    const payer = base58ToKeypair(base58PrivateKey);

    console.log("开始创建token mint");

    // const mintKeypair = Keypair.generate();

    console.log("开始生成虚荣地址");
    const mintKeypair = await generateVanityAddress("", "fan");
    if (!mintKeypair) {
        throw new Error("未找到满足要求的 keypair,请重试");
    }
    console.log("虚荣地址生成成功: ", mintKeypair.publicKey.toBase58());

    // const mint = await createMint(
    //     connection,
    //     payer,
    //     payer.publicKey,
    //     payer.publicKey,
    //     9,
    //     mintKeypair,
    //     { commitment: connection.commitment },
    //     TOKEN_PROGRAM_ID
    // );

    // console.log("token mint创建成功, mint: ", mint);

    // console.log("开始获取 token mint的信息");
    // const mintInfo = await getMint(
    //     connection,
    //     mintKeypair.publicKey,
    //     connection.commitment,
    //     TOKEN_PROGRAM_ID
    // );
    // console.log("token mint的信息:", mintInfo);
}

main()
    .then()
    .catch((e) => {
        console.log(e);
    });
