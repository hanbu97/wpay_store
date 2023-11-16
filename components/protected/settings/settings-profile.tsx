"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/types/collection";
import { FC } from "react";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { generateEntitySecretCipherText } from "@/lib/utils";

interface SettingsProfileProps {
  user: Profile;
}

interface WalletResponse {
  data: {
    wallet: {
      id: string;
      state: string;
      walletSetId: string;
      custodyType: string;
      address: string;
      blockchain: string;
      accountType: string;
      updateDate: string;
      createDate: string;
    };
  };
}

interface TokenBalanceResponse {
  data: {
    tokenBalances: Array<{
      token: {
        id: string;
        blockchain: string;
        tokenAddress: string;
        standard: string;
        name: string;
        symbol: string;
        decimals: number;
        isNative: boolean;
        updateDate: string;
        createDate: string;
      };
      amount: string;
      updateDate: string;
    }>;
  };
}

const SettingsProfile: FC<SettingsProfileProps> = ({ user }) => {
  const form = useForm();
  // const watchToAddress = form.watch("account"); 

  const fetchWalletInfo = (walletID: string): Promise<WalletResponse> => {
    const url = `https://api.circle.com/v1/w3s/wallets/${walletID}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'
      }
    };
  
    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json: WalletResponse) => json)
      .catch(err => {
        console.error('error:' + err);
        throw err;
      });
  }

  const fetchTokenBalance = (walletID: string, tokenAddress: string): Promise<number> => {
    const url = `https://api.circle.com/v1/w3s/wallets/${walletID}/balances?tokenAddress=${tokenAddress}&pageSize=10`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'
      }
    };
  
    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json: TokenBalanceResponse) => {
        const tokenBalance = json.data.tokenBalances.find(tb => tb.token.tokenAddress === tokenAddress);
        return tokenBalance ? parseFloat(tokenBalance.amount) : 0;
      })
      .catch(err => {
        console.error('error:' + err);
        return 0; // Return 0 in case of any errors
      });
  }
  

  // fetchWalletInfo(user.wallet_id ?? '')
  // .then(response => {
  //   console.log(response);
  //   // 这里处理获取到的钱包信息
  // })
  // .catch(error => {
  //   console.error(error);
  //   // 错误处理
  // });

  // var tokenAmount = 0.0;
  const [tokenAmount, setTokenAmount] = useState(0.0);

  fetchTokenBalance(user.wallet_id ?? '', '0x07865c6e87b9f70255377e024ace6630c1eaa37f')
  .then(amount => {
    console.log(amount); // 输出特定tokenAddress的金额
    setTokenAmount(amount);
  })
  .catch(error => {
    console.error(error);
    // 错误处理
  });

  function convertToBlockchainAmount(amount, decimals ) {
    const factor = Math.pow(10, decimals);
    const bigNumber = Math.floor(amount * factor); // 使用Math.floor来避免四舍五入的问题
    return bigNumber.toString();
  }

  function postTransaction(amountDecimal, idempotencyKey, entitySecretCipherText, tokenId, walletId, tokenID, destinationAddress: String) {
    const url = 'https://api.circle.com/v1/w3s/developer/transactions/transfer';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer TEST_API_KEY:0e7621ef8bfe37335d4ff9a03cfca8e4:5f276f7cbb2e5ec43c35fc32bbf09ecf'
      },
      body: JSON.stringify({
        amounts: [amountDecimal],
        entitySecretCiphertext: entitySecretCipherText,
        destinationAddress: destinationAddress,
        tokenId: tokenId,
        walletId: walletId,
        idempotencyKey: idempotencyKey,
        feeLevel: 'MEDIUM'
      })
    };
  
    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(json => {
        console.log(json);
        return json; // 返回响应 JSON
      })
      .catch(err => {
        console.error('error:' + err);
      });
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>
                Current USDC received from sales
              </CardDescription>
            </CardHeader>
            <Separator className="mb-8" />
            <CardContent className="space-y-4">
              <div className="mx-auto flex max-w-3xl flex-col justify-center">
              <div className="col-span-full flex items-center gap-x-8 text-6xl font-bold">
                {tokenAmount.toFixed(2)} USDC
              </div>
              </div>
              <FormField
                name="account"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"Input wallet address to withdraw to"}
                        {...field}
                        className="max-w-md text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const toAddress = form.getValues("account");
                    const amount = (tokenAmount - 1.0) > 0 ? (tokenAmount - 1.0) : 0;
                    // const amountDecimal = convertToBlockchainAmount(amount, 6);
                    const amountDecimal = amount.toFixed(6);
                    const idempotencyKey = uuidv4(); 
                    const entitySecretCipherText =  generateEntitySecretCipherText();
                    // const tokenId = uuidv4(); 
                    const walletId = user.wallet_id;
                    const tokenID = '73eab1a4-02e9-5ce6-bb5f-c6d0fbdb93bb';

                    // console.log(entitySecretCipherText);
                    // console.log(`amountDecimal: ${amountDecimal}`);
                    // console.log(`idempotencyKey: ${idempotencyKey}`);
                    // console.log(`tokenId: ${tokenId}`);
                    // console.log(`walletId: ${walletId}`);
                    postTransaction(amountDecimal, idempotencyKey, entitySecretCipherText, tokenID, walletId, tokenID, toAddress);

                  }}
                  className="rounded-md bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100"
                >
                  Withdraw Balance
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default SettingsProfile;
