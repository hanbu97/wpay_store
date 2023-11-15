
export interface OrdersRes {
    data: Data;
  }
  
  export interface Data {
    transactions: Transaction[];
  }
  
  export interface Transaction {
    abiParameters: null;
    amounts: string[];
    blockchain: string;
    blockHash: string;
    blockHeight: number;
    createDate: string;
    custodyType: string;
    destinationAddress: string;
    firstConfirmDate: string;
    id: string;
    networkFee: string;
    nfts: null;
    operation: string;
    sourceAddress: string;
    state: string;
    tokenId: string;
    transactionType: string;
    txHash: string;
    updateDate: string;
    walletId: string;
  }