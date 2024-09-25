import { generateVanityAddress } from "vanity-solana/dist/vanity-address";

async function main() {
    console.log("hello");

    let k = generateVanityAddress("", "fan", true, () => {});

    console.log(k.publicKey.toBase58());
}

main().then().catch();
