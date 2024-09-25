import {
    createInitializeMint2Instruction,
    createMint,
    getAccount,
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
    // const mint = await createMint(
    //     connection,
    //     payer,
    //     payer.publicKey,
    //     payer.publicKey,
    //     9,
    //     undefined,
    //     { commitment: connection.commitment },
    //     TOKEN_PROGRAM_ID
    // );
    let programId = TOKEN_PROGRAM_ID;
    let decimals = 9;

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();
    const transaction = new Transaction().add(

        // 创建账户
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: keypair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId,
        }),

        // 初始化
        createInitializeMint2Instruction(
            keypair.publicKey,
            decimals,
            payer.publicKey,
            payer.publicKey,
            programId
        )
    );

    await sendAndConfirmTransaction(connection, transaction, [payer, keypair], {
        commitment: connection.commitment,
    });

    console.log("token mint创建成功, mint: ", keypair.publicKey);

    // getAccount(connection, keypair.publicKey, connection.commitment)
    const accInfo = await connection.getAccountInfo(
        keypair.publicKey,
        connection.commitment
    );
    console.log("accountInfo: ", accInfo);

    console.log("开始获取 token mint的信息");
    const mintInfo = await getMint(
        connection,
        keypair.publicKey,
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
