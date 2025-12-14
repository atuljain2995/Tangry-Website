export const BuyOnline = () => {
  return (
    <>
      {/* Hashtag Banner */}
      <section className="py-8 bg-[#FFD54F] overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="inline-flex items-center mx-8">
              <span className="text-2xl md:text-3xl font-bold text-[#D32F2F]">#TasteMeinBest</span>
              <span className="text-2xl md:text-3xl font-bold text-gray-800 ml-2">Tangry</span>
            </div>
          ))}
        </div>
      </section>

      {/* Buy Online Section */}
      <section className="py-16 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Buy Online</h2>
          <p className="text-red-100 mb-8 text-lg">Get your favourite Tangry products delivered to your doorstep!</p>
          
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <a 
              href="https://www.amazon.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.5 8.5c0-1.1-.9-2-2-2h-5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-7zm5.3 9.3c-1.1 1.1-2.9 1.7-5.3 1.7h-.5c-1.9 0-3.6-.4-4.9-1.1-.2-.1-.4 0-.5.2l-.3.3c-.1.1-.1.3 0 .4 1.5.9 3.4 1.4 5.7 1.4h.5c2.7 0 4.8-.7 6.1-2 .1-.1.1-.3 0-.5l-.3-.3c-.1-.1-.3-.2-.5-.1z"/>
              </svg>
              <span>Amazon</span>
            </a>
            
            <a 
              href="https://www.bigbasket.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>BigBasket</span>
            </a>
            
            <a 
              href="https://www.blinkit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
              </svg>
              <span>Blinkit</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

