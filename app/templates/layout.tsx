import React from 'react';

const TemplatesLayout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-full min-h-screen bg-background pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-y-hidden">
      <div className="w-full max-w-7xl">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TemplatesLayout;