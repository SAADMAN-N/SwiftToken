'use client';

import { PurchaseCredits } from '../components/credits/PurchaseCredits';
import { StripePurchaseCredits } from '../components/credits/StripePurchaseCredits';

export default function CreditsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Credits</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StripePurchaseCredits />
            <div className="border-t lg:border-l lg:border-t-0 lg:pl-8 pt-8 lg:pt-0">
              <PurchaseCredits />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900">
          <h3 className="font-medium mb-2">About Credits</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Credits can be purchased with either credit card or SOL. Each credit allows you to generate one unique memecoin with AI-powered name, description, and image generation.
          </p>
        </div>
      </div>
    </div>
  );
}
