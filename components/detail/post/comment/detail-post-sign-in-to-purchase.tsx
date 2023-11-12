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

const DetailPostSignInToPurchase = () => {
  const [sdk, setSDK] = useState<MetaMaskSDK>();
  const [response, setResponse] = useState<any>('');
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [activeProvider, setActiveProvider] = useState<SDKProvider>();
  const [chain, setChain] = useState('');

  useEffect(() => {
    const doAsync = async () => {
      const clientSDK = new MetaMaskSDK({
        useDeeplink: false,
        communicationServerUrl: process.env.NEXT_PUBLIC_COMM_SERVER_URL,
        checkInstallationImmediately: false,
        i18nOptions: {
          enabled: true
        },
        dappMetadata: {
          name: 'NEXTJS demo',
          url: window.location.host,
        },
        logging: {
          developerMode: false,
        },
        storage: {
          enabled: true,
          // enabled: false,
        },
      });
      await clientSDK.init();
      setSDK(clientSDK);
    };
    doAsync();
  }, []);

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

  const connectAndSign = async () => {
    console.log('connectAndSign');
    try {
      const signResult = await sdk?.connectAndSign({
        msg: 'Connect + Sign message'
      });
      setResponse(signResult);
      setAccount(window.ethereum?.selectedAddress ?? '');
      setConnected(true);
      setChain(window.ethereum?.chainId ?? '');
    } catch (err) {
      console.warn(`failed to connect..`, err);
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
    <SDKContainer></SDKContainer>
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
