import { MainPostItem, MainPostItemLoading } from "@/components/main";
import { SharedEmpty, SharedPagination } from "@/components/shared";
import { PostWithCategoryWithProfile, Profile } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { v4 } from "uuid";
import { randomBytes } from "crypto";
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import forge from 'node-forge';
 
export const revalidate = 0;

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface NewWallet {
  data: Data;
}

export interface Data {
  wallets: Wallet[];
}

export interface Wallet {
  accountType?: string;
  address?: string;
  blockchain?: string;
  createDate?: string;
  custodyType?: string;
  id?: string;
  state?: string;
  updateDate?: string;
  walletSetId?: string;
}


export default async function HomePage({ searchParams }: HomePageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


  // {
  //   // create wallet set
  //   const url = 'https://api.circle.com/v1/w3s/developer/walletSets';
  //   const apiKey = 'TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf';

  //   const idempotencyKey = uuidv4();
  //   // const idempotencyKey = '<UNIQUE_UUID>'; // 生成或指定一个唯一的 UUID
  //   const entitySecretCipherText = 'Smi4jyG8rTUOyA+TQdkUS7zEnEYVqyp4qaRCZMU2uXBIG9BShp5mVtwnY6B6V1LXOIBHfYEgQk4CvVodZETvvDqqSgdsufD7DFXF89B02GoS19pZIzpqtgPCCxHanYqIM6GsQWV+KWrG1Jli0kO3taeWep2SzxdHFqyx0wcBOvKHG0Fk/g1DXUU5okwjEz7oP6Pbs+QOTkEM+h7BEZ5os3RADeTPDdfS1MYBpcf98MdTPzBBUHdQ48XjIiTSId9AfAeM2DIEzjccW+BoC/lOgFePcHBN9FuXxVkZYr9r9nhhVMDQeLjbsvnIWSP3TTRQKhQ5QSG3z75SisfcBx/+8XBlylI/QYQHPvcUeLxrFc/vT3+ewrFDOlyAkLgtkHqskoXT7GuSSkj8f7Ze9JimHUabUd4Drn00sWIwQXiwGLpAu+g5kJ8Me7w8lMsLHTu7/u3gP2JsQ3PwZ8jLbrRmGa/mTjO2aCR05kbt6FM47K1oKsdLlz5djLbtAqRX9amI+SfFh705O8UMiYpIj0cOhRMjkAIgJKeSf+RBcSFFBbTa3EhsWqmrMaQgAvp2KtMZqtUj9GvZzhwBtQ8NdvlZYCygGxSxnB8z2Yjbxxpg511MpV29pRJfPoJRz1SznnunNCdRervpCp6lHedblUhN3nWFtWZvVpRu5eI8WoBQ4Yk='; // 生成的实体密文
  //   const name = 'test1'; // 钱包集名称
    
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json', 
  //       Authorization: `Bearer ${apiKey}`
  //     },
  //     body: JSON.stringify({
  //       idempotencyKey: idempotencyKey,
  //       entitySecretCipherText: entitySecretCipherText,
  //       name: name
  //     })
  //   };
  // }

//   const createWallet = async () => {
//     const entitySecret = forge.util.hexToBytes('YOUR_ENTITY_SECRET')
//     const publicKey = forge.pki.publicKeyFromPem('YOUR_PUBLIC_KEY')
//     const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
//       md: forge.md.sha256.create(),
//       mgf1: {
//         md: forge.md.sha256.create(),
//       },
// })
//   }
  
  const createWallet = async (): Promise<Wallet | null> => {
    // const options = {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json', Authorization: 'Bearer TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'},
    //   body: '{"idempotencyKey":"<UNIQUE_UUID>","entitySecretCipherText":"<GENERATED_ENTITY_SECRET_CIPHERTEXT>","name":"<WALLET_SET_NAME>"}'
    // };
    const publicKeyPem = `-----BEGIN RSA PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAznSDm8UhlliFKh8NNVhg
    TjkWuMv8V3eN53C+fLgdT8CmCnFEtOpqO1/ID/YSjoAxZTgIRIcQ/bTQKaomqS4l
    0iz0fYUfNJRK0uVas4Ny3Kq+0KNmUEov26bBNIzxpDSIm3eBqFZAd4a0BOzNA2RT
    CebTwvMA8+PCSoM3+u0flbPrszCQUxRUE3cYVkuBhDgKZElm01hXnD9TBqKDl6Hq
    DkSFWm4SHbVXYY+VrC/Zk7BZtNinrDSmtFGbs4fw/ZvZKlT6HXzey29IGGvdoUmv
    1XKpyib/ZjHysH1YfPAyMyDYxBHMc3VJbObVlM/VrhXJ/4Za7bAjLO961me8Y8j6
    EZ5tZoGllDeOg/ttf8Y0LOPKphPmdhFW36QDrxilTlMu4Q9y6OqLUrkIjB2DDu97
    mFnjZB4sQtHj9J/G0+/4LICU5ZlLZgFeg32rg2mlSX6S19F2Ma63zCQTAooB4of+
    i2Cqv0/8Joa9G0k14n/bbjuV/hagElOwgBK5uG5T7O8Yx6DOBrJ6Et3LlR/nwQPm
    3l5v8Wt+LVtBN7EXmzRuQCaDmO+33lQlCEfAJ6qU7vG2XnOVGcD61dM2NTEFZz4n
    dMkkSSY0G+zLg2tCQVV/UT22FR2u1zQq3+L0yJItulbkw522cwzlyzz+/2GkkFzu
    4ttLi77wN+y4Ds43S/BfrpkCAwEAAQ==
    -----END RSA PUBLIC KEY-----
    `;
    const entitySecret = forge.util.hexToBytes('6dd6b84301122e9df3d33768524fff249f0fe5dccf35f0c201c1d05faa7548c5')
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
    // const entitySecretCipherText = 'FYbj7mzOBG5f2LB1T6DPxIggYnap/v18PLjpjDCtnoLJBc/U8jO3vnckMXLJYEiGkA/D5crw3pjvaPmkrCHKnE9NMbw99eFRcURGrQqf3/dCCYFS9osJStrcCcuxmACmsZF8z3dvsU9gae/ZVv9DkqyFFqsxdZ/NHZxXvCND9jgnLaS5DTgTEvLn95+vIYvB5XOgAZlK/v5QsSnH8hsMYrAVQcTbccWbsegIF4MipMRLQC/q9ZALnotWurr1krw+lgl5ne2ljz3LPyI1/CqGv22SNyQrnGQ5edshw1MqzvyKO2Aj7GKhY0fxfKByIi6D5KVS+Y7ii3ciFj8U3q9TfzuDkyYjKqDgfrOp4jyz7fxysJERk8miF8SCqs8nbhatZA2iV81unhu0vcrPIBZPNNCh2OJUV5sVImb91ANPEx37YIJn6y8EwjKmcyjjSL3ZXtbpsutLwHrMYF0gACABTUZ7RUmUk9QVYxSis45+g8vdHAuvRe88PrUB2sBUAFSoNiOHFxeceX4GbSA4JrvAE9EAlkfJzAdluRMUdJs2ETetip3wU/mrcPYtJHV2v3VPjR53Eb0rYsuOPg9rdbo058GIHwLRZANtWhOxK5geTN26/sO2n85tzWwtfM7PchgQfui8mJB+n+I3dbDycsYyE6Q4IiJU0yU+7HJhgt7jOmM='; // 生成的实体密文
    const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    })
    const entitySecretCipherText = forge.util.encode64(encryptedData);
    
    const idempotencyKey = uuidv4(); // 生成的唯一 UUID
    const apiKey = 'TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'; // 您的 API 密钥
    const blockchain1 = 'ETH-GOERLI'; // 第一个区块链名称
    const walletSetId = '018bce4a-5959-78c6-9c49-b02a7283e43d'; // 之前生成的钱包集的 ID
    const count = 1;

    // 构建请求选项
    const url = 'https://api.circle.com/v1/w3s/developer/wallets';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        idempotencyKey: idempotencyKey,
        entitySecretCipherText: entitySecretCipherText,
        blockchains: [blockchain1],
        count: count,
        walletSetId: walletSetId
      })
    };
    
    try {
      const response = await fetch(url, options);
      const responseData = await response.json() as NewWallet;

      const data = responseData.data.wallets[0];

      return data;
    } catch (error) {
      console.error(error);
      return null; 
    }
  };


  // check wallet
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
      console.log("Session Found");

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .match({ id: userId })
        .single<Profile>();

      if (data?.address == null) {
        const wallet = await createWallet();
        if (wallet != null) {
           // add wallet to account
          const { error } = await supabase
          .from("profiles")
          .update({
            id: data?.id,
            address: wallet.address,
          })
          .match({ id: data?.id })
          .select()
          .single();
        }
      } 
  } else {
    console.log("Session Notfound");
  }

  // Fetch total pages
  const { count } = await supabase
    .from("drafts")
    .select("*", { count: "exact", head: true });

  // Pagination
  const limit = 10;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;
  const from = (page - 1) * limit;
  const to = page ? from + limit : limit;
  
  const { data, error } = await supabase
    .from("drafts")
    .select(`*, categories(*), profiles(*)`)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<PostWithCategoryWithProfile[]>();

  if (!data || error || !data.length) {
    notFound;
  }

  return (
    <>
      <div className="space-y-6">
        {data?.length === 0 ? (
          <SharedEmpty />
        ) : (
          data?.map((post) => (
            <Suspense key={v4()} fallback={<MainPostItemLoading />}>
              <MainPostItem post={post} />
            </Suspense>
          ))
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <SharedPagination
          page={page}
          totalPages={totalPages}
          baseUrl="/"
          pageUrl="?page="
        />
      )}
    </>
  );
}
