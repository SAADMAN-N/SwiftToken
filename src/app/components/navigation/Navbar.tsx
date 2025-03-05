import Link from 'next/link';
import { WalletConnect } from '../WalletConnect';
import { CreditsDisplay } from '../credits/CreditsDisplay';

export function Navbar() {
  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🚀</span>
          <span className="text-xl font-bold">SwiftToken</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <CreditsDisplay />
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
