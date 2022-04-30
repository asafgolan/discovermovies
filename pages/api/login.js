import atob from 'atob';
import jwt from 'jsonwebtoken';

import {setTokenCookie} from '../../lib/cookies';
// Somewhere before Magic Admin usage
globalThis.atob = atob;

import {magicAdmin} from '../../lib/magic';
import {isNewUser,createNewUser} from "../../lib/db/hasura";


export default  async function login(req,res){
    if(req.method === 'POST'){
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : "";

            const metadata = await magicAdmin.users.getMetadataByToken(didToken);

            const token = jwt.sign(
                {
                    ...metadata,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                    "https://hasura.io/jwt/claims": {
                        "x-hasura-allowed-roles": ["user", "admin"],
                        "x-hasura-default-role": "user",
                        "x-hasura-user-id": `${metadata.issuer}`,
                    },
                },
                process.env.JWT_SECRET
            );

            const isNewUserQuery = await isNewUser(token,metadata.issuer);

            isNewUserQuery && await createNewUser(token,metadata);
            setTokenCookie(token, res);
            res.send({done:true});
        }catch (e) {
            console.log(e);
            res.status(500).send({done:false,error: e.message});
        }
    }else {
        res.send({done:false});
    }
}

