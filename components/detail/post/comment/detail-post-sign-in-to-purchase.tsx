"use client";

import { LoginSection } from "@/components/login";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { detailCommentConfig } from "@/config/detail";
import React, { useEffect, useState } from "react";
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import {
  ConnectionStatus,
  EventType,
  ServiceStatus,
} from '@metamask/sdk-communication-layer';
import SDKContainer from "./SDKContainer";
import { ethers } from 'ethers';
import Web3 from 'web3';

function getDataFieldValue(tokenRecipientAddress, tokenAmount) {
  const web3 = new Web3();
  const TRANSFER_FUNCTION_ABI = {
      "constant": false,
      "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
      "name": "transfer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  };

  return web3.eth.abi.encodeFunctionCall(TRANSFER_FUNCTION_ABI, [
      tokenRecipientAddress,
      web3.utils.toHex(tokenAmount)
  ]);
}


const DetailPostSignInToPurchase = () => {
  const [sdk, setSDK] = useState<MetaMaskSDK>();
  const [response, setResponse] = useState<any>('');
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [activeProvider, setActiveProvider] = useState<SDKProvider>();
  const [chain, setChain] = useState('');
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>();

  const doAsync = async () => {
    const clientSDK = new MetaMaskSDK({
      useDeeplink: false,
      communicationServerUrl: process.env.NEXT_PUBLIC_COMM_SERVER_URL,
      checkInstallationImmediately: false,
      i18nOptions: {
        enabled: true
      },
      dappMetadata: {
        name: 'wpay',
        url: window.location.host,
      },
      logging: {
        developerMode: false,
      },
      storage: {
        enabled: true,
      },
    });
    await clientSDK.init();
    setSDK(clientSDK);
  };

  useEffect(() => {
    doAsync();
  }, []);

  useEffect(() => {
    if (!sdk || !activeProvider) {
      return;
    }

    // activeProvider is mapped to window.ethereum.
    console.debug(`App::useEffect setup active provider listeners`);
    if (window.ethereum?.selectedAddress) {
      console.debug(`App::useEffect setting account from window.ethereum `);
      setAccount(window.ethereum?.selectedAddress);
      setConnected(true);
    } else {
      setConnected(false);
    }

    const onChainChanged = (chain: unknown) => {
      console.log(`App::useEfect on 'chainChanged'`, chain);
      setChain(chain as string);
      setConnected(true);
    };

    const onInitialized = () => {
      console.debug(`App::useEffect on _initialized`);
      setConnected(true);
      if (window.ethereum?.selectedAddress) {
        setAccount(window.ethereum?.selectedAddress);
      }

      if (window.ethereum?.chainId) {
        setChain(window.ethereum.chainId);
      }
    };

    const onAccountsChanged = (accounts: unknown) => {
      console.log(`App::useEfect on 'accountsChanged'`, accounts);
      setAccount((accounts as string[])?.[0]);
      setConnected(true);
    };

    const onConnect = (_connectInfo: any) => {
      console.log(`App::useEfect on 'connect'`, _connectInfo);
      setConnected(true);
      setChain(_connectInfo.chainId as string);
    };

    const onDisconnect = (error: unknown) => {
      console.log(`App::useEfect on 'disconnect'`, error);
      setConnected(false);
      setChain('');
    };

    const onServiceStatus = (_serviceStatus: ServiceStatus) => {
      console.debug(`sdk connection_status`, _serviceStatus);
      setServiceStatus(_serviceStatus);
    };

    window.ethereum?.on('chainChanged', onChainChanged);

    window.ethereum?.on('_initialized', onInitialized);

    window.ethereum?.on('accountsChanged', onAccountsChanged);

    window.ethereum?.on('connect', onConnect);

    window.ethereum?.on('disconnect', onDisconnect);

    sdk.on(EventType.SERVICE_STATUS, onServiceStatus);

    return () => {
      console.debug(`App::useEffect cleanup activeprovider events`);
      window.ethereum?.removeListener('chainChanged', onChainChanged);
      window.ethereum?.removeListener('_initialized', onInitialized);
      window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum?.removeListener('connect', onConnect);
      window.ethereum?.removeListener('disconnect', onDisconnect);
      sdk.removeListener(EventType.SERVICE_STATUS, onServiceStatus);
    }
  }, [activeProvider])

  const terminate = () => {
    sdk?.terminate();
    setChain('');
    setAccount('');
    setResponse('');

    console.log("termintated and reset");
  };

  async function sendTokenTransaction(tokenContractAddress, tokenRecipientAddress, tokenAmount) {
    const dataFieldValue = getDataFieldValue(tokenRecipientAddress, tokenAmount);
  
    const transactionParameters = {
        from: sdk!.getProvider().selectedAddress, // 使用 MetaMask 选定的地址
        to: tokenContractAddress,      // 代币合约地址
        data: dataFieldValue           // 编码后的数据字段
    };
  
    try {
        const txHash = await sdk!.getProvider().request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        console.log('Transaction hash:', txHash);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
  }

  useEffect(() => {
    if (!sdk?.isInitialized()) {
      return;
    }

    const onProviderEvent = (accounts?: string[]) => {
      if (accounts?.[0]?.startsWith('0x')) {
        setConnected(true);
        setAccount(accounts?.[0]);
      } else {
        setConnected(false);
        setAccount('');
      }
      setActiveProvider(sdk.getProvider());
    };
    // listen for provider change events
    sdk.on(EventType.PROVIDER_UPDATE, onProviderEvent);
    return () => {
      sdk.removeListener(EventType.PROVIDER_UPDATE, onProviderEvent);
    };
  }, [sdk]);

  const changeNetwork = async (hexChainId: string) => {
    console.debug(`switching to network chainId=${hexChainId}`);
    try {
      const response = await sdk!.getProvider().request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }], // chainId must be in hexadecimal numbers
      });
      console.debug(`response`, response);
    } catch (err) {
      console.error(err);
    }
  };

  const connectAndSign = async () => {
    doAsync();

    console.log('connectAndSign');

    try {
      const signResult = await sdk?.connectAndSign({
        msg: 'Your order id is: xxxxxxxx. Order at: 1111111111'
      });
      

      // log signed orderid
      console.log(signResult);
      setResponse(signResult);
      setAccount(window.ethereum?.selectedAddress ?? '');
      setConnected(true);
      setChain(window.ethereum?.chainId ?? '');
      setActiveProvider(sdk!.getProvider());

      console.log(window.ethereum?.selectedAddress);
      console.log(window.ethereum?.chainId);

      if (window.ethereum?.chainId != "0x5") {
        await changeNetwork('0x5');
      }

      // send usdc
      const to = '0x440a29ac73dC9b342c61098bdf8a9401A28c9534';
      const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';
      const amount = '10'; 
      await sendTokenTransaction(usdcAddress, to, 1000000);

      console.log("pay succeed!");
      terminate();
    } catch (err) {
      console.warn(`failed to connect..`, err);
      terminate();
    }
  };

  return (
   <>
    <Button
      type="button"
      onClick={connectAndSign}
      className="group flex w-full mt-8 rounded-lg bg-gradient-to-t from-gray-200 via-gray-100 to-gray-50 p-2 text-center text-gray-400 shadow-md shadow-black/5 ring-1 ring-black/10 transition duration-200 hover:bg-gradient-to-tr hover:from-gray-200 hover:via-gray-100 hover:to-gray-50 active:scale-[96%] active:ring-black/20"
    >
      <span className="text-gray-600">
        Place Order
      </span>
    </Button>
    <Button
      type="button"
      onClick={terminate}
      className="group flex w-full mt-4 rounded-lg bg-transparent p-2 text-center shadow-md shadow-black/5 ring-1 ring-white transition duration-200 hover:bg-gradient-to-tr active:scale-[96%] active:ring-black/20"
    >
      <span className="text-white">
        Terminate
      </span>
    </Button>
    {/* <SDKContainer></SDKContainer> */}
    </>
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button
    //       type="button"
    //       className="group flex w-full mt-8 rounded-lg bg-gradient-to-t from-gray-200 via-gray-100 to-gray-50 p-2 text-center text-gray-400 shadow-md shadow-black/5 ring-1 ring-black/10 transition duration-200 hover:bg-gradient-to-tr hover:from-gray-200 hover:via-gray-100 hover:to-gray-50 active:scale-[96%] active:ring-black/20"
    //     >
    //       <span className="text-gray-600">
    //         Place Order
    //       </span>
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="font-sans sm:max-w-[425px]">
    //     {/* TODO */}
    //   </DialogContent>
    // </Dialog>
  );
};

export default DetailPostSignInToPurchase;
