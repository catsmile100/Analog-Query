import { TimegraphClient } from "@analog-labs/timegraph-js";
import { new_cert, build_apikey, encode_ssk, build_ssk } from "@analog-labs/timegraph-wasm";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";

(async () => {
    await waitReady();
    let cert_data, secret;
    const addr = "<address_dot>";
    const PHRASE = "<seed>";
    
    const keyring = new Keyring({ type: "sr25519" });
    const keyPair = keyring.addFromUri(PHRASE);
    
    [cert_data, secret] = new_cert(addr, "developer");
    
    const signature = keyPair.sign(cert_data);
    const key = build_apikey(secret, cert_data, signature);
    
    const ssk_data = encode_ssk({
        ns: 0,
        key: addr,
        user_id: 1,
        expiration: 0,
    });
    
    const ssk_signature = keyPair.sign(ssk_data);
    const ssk = build_ssk(ssk_data, ssk_signature);
    
    const client = new TimegraphClient({
        url: "https://timegraph.testnet.analog.one/graphql",
        sessionKey: ssk,
    });
    
    const response1 = await client.alias.add({
        hashId: "<hash_id>", 
        name: "<Name_project>", 
    });
    
    console.log(response1);
    
    const response2 = await client.view.data({
        hashId: "<hash_id>", 
        fields: ["_clock", "_index"], 
        limit: "10", 
    });
    
    console.log(response2);
})();
