import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Build Your Website Effectively
        </h1>
        <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto">
          Launch your online store faster — built to grow, convert, and succeed.
        </p>
      </section>


      <section className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto mt-30">
        {/* Free Plan Card */}
        <div className="card free-card p-6 rounded-lg transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Free Plan</h2>
            <span className="bg-highlight-primary text-background-primary px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </span>
          </div>
          <div className="text-3xl font-bold mb-2 text-highlight">
            FREE
          </div>
          <p className="text-secondary mb-6">Ideal for startups and early-stage businesses</p>
          <ul className="mb-6 space-y-3">
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-accent-green mr-2" />
              <span>Public Git repository</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-accent-green mr-2" />
              <span>Basic website template</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-accent-green mr-2" />
              <span>DIY functionality integration</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-accent-green mr-2" />
              <span>Community-driven support</span>
            </li>
          </ul>
          <button className="btn btn-secondary w-full py-2">
            Get Started for Free
          </button>
        </div>

        {/* Premium Plan Card */}
        <div className="card p-6 relative border-2 border-highlight-primary shadow-lg transition-all premium-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Premium Plan</h2>
            <span className="bg-highlight-primary text-background-primary px-3 py-1 rounded-full text-sm font-medium">
              Recommended
            </span>
          </div>
          <div className="text-2xl font-bold mb-2 text-highlight">Contact Us</div>
          <p className="text-secondary mb-6">Best for growing and enterprise-level businesses</p>
          <ul className="mb-6 space-y-3">
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-highlight-primary mr-2" />
              <span className="font-medium">Custom design & branding</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-highlight-primary mr-2" />
              <span className="font-medium">End-to-end deployment</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-highlight-primary mr-2" />
              <span className="font-medium">Advanced integrated features</span>
            </li>
            <li className="flex items-center text-base">
              <CheckCircle className="w-5 h-5 text-highlight-primary mr-2" />
              <span className="font-medium">Priority customer support</span>
            </li>
          </ul>
          <Link
            href={"/templates"}
            className="btn btn-primary w-full py-2">
            Explore Premium
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Page;
