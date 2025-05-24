'use client';

import { PropsWithChildren, useState, useEffect } from 'react';
import { sepolia, mainnet } from '@starknet-react/chains';
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
  Connector,
} from '@starknet-react/core';

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' };
      case sepolia:
      default:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' };
    }
  },
});

// Define contract addresses
const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

// Define session policies
const policies = {
  contracts: {
    [ETH_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "Approve spending of tokens",
        },
        { 
          name: "transfer", 
          entrypoint: "transfer" 
        },
      ],
    },
  },
};

// Create a proper Cartridge connector wrapper
class CartridgeConnectorWrapper extends Connector {
  private _cartridgeConnector: any = null;
  private _account: any = null;
  private _isConnected = false;

  constructor() {
    super();
  }

  get id() {
    return 'cartridge';
  }

  get name() {
    return 'Cartridge Controller';
  }

  get icon() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiMwMDAwMDAiLz4KPC9zdmc+';
  }

  available() {
    return true;
  }

  async ready() {
    return true;
  }

  async request(call: any) {
    if (!this._cartridgeConnector || !this._isConnected) {
      throw new Error('Cartridge connector not connected');
    }
    return await this._cartridgeConnector.request(call);
  }

  async connect() {
    try {
      console.log('Connecting to Cartridge...');
      
      if (!this._cartridgeConnector) {
        // Import and create the connector only when connect is called
        const { ControllerConnector } = await import('@cartridge/connector');
        
        console.log('ControllerConnector imported:', ControllerConnector);
        
        // Try creating the connector with different strategies
        try {
          // Strategy 1: With policies and chains (which is required)
          console.log('Trying to create ControllerConnector with policies and chains...');
          this._cartridgeConnector = new (ControllerConnector as any)({
            policies,
            chains: [
              {
                id: '0x534e5f5345504f4c4941', // SN_SEPOLIA
                rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
              },
            ],
            defaultChainId: '0x534e5f5345504f4c4941', // SN_SEPOLIA
          });
          console.log('ControllerConnector created with policies and chains');
        } catch (policyError) {
          console.warn('Failed with full config, trying simpler:', policyError);
          try {
            // Strategy 2: Just chains without policies
            console.log('Trying to create ControllerConnector with just chains...');
            this._cartridgeConnector = new (ControllerConnector as any)({
              chains: [
                {
                  id: '0x534e5f5345504f4c4941', // SN_SEPOLIA  
                  rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
                },
              ],
              defaultChainId: '0x534e5f5345504f4c4941',
            });
            console.log('ControllerConnector created with just chains');
          } catch (emptyError) {
            console.warn('Failed with chains, trying minimal:', emptyError);
            // Strategy 3: Absolutely minimal
            this._cartridgeConnector = new (ControllerConnector as any)({
              chains: [],
            });
            console.log('ControllerConnector created with empty chains');
          }
        }
        
        console.log('ControllerConnector created successfully');
      }

      // Connect using the Cartridge connector (this should show the popup)
      console.log('Attempting to connect...');
      const account = await this._cartridgeConnector.connect();
      
      this._account = account;
      this._isConnected = true;
      
      console.log('Connected to Cartridge:', account);
      
      return account;
    } catch (error) {
      console.error('Failed to connect to Cartridge:', error);
      
      // Reset state if connection failed
      this._account = null;
      this._isConnected = false;
      this._cartridgeConnector = null;
      
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this._cartridgeConnector && this._isConnected) {
        await this._cartridgeConnector.disconnect();
      }
      
      this._account = null;
      this._isConnected = false;
      
      console.log('Disconnected from Cartridge');
    } catch (error) {
      console.error('Failed to disconnect from Cartridge:', error);
    }
  }

  account() {
    return this._account;
  }

  async chainId() {
    if (this._cartridgeConnector) {
      return await this._cartridgeConnector.chainId();
    }
    return '0x534e5f5345504f4c4941'; // SN_SEPOLIA
  }
}

export function StarknetProvider({ children }: PropsWithChildren) {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Create the Cartridge connector wrapper
    const loadConnector = async () => {
      try {
        const cartridgeConnector = new CartridgeConnectorWrapper();
        setConnectors([cartridgeConnector]);
        console.log('Cartridge connector wrapper created');
      } catch (error) {
        console.error('Error setting up Cartridge connector:', error);
        setConnectors([]);
      }
    };

    loadConnector();
  }, []);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={provider}
        connectors={[]}
        explorer={starkscan}
      >
        {children}
      </StarknetConfig>
    );
  }

  // Client-side render with connectors
  return (
    <StarknetConfig
      autoConnect={false}
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={starkscan}
    >
      {children}
    </StarknetConfig>
  );
} 