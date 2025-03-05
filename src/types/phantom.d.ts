interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      isPhantom?: boolean;
    };
  };
}

declare interface Window extends PhantomWindow {}