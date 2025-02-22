export default function About() {
  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About CrowdFunded</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;re on a mission to help creative projects come to life. Our platform connects innovators with backers who believe in their ideas.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/20 overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                Founded in 2024, CrowdFunded was born from a simple idea: everyone should have the opportunity to bring their creative projects to life. We believe that great ideas can come from anywhere, and with the right support, they can become reality.
              </p>
              <p className="mb-4">
                Our platform has helped thousands of creators launch their projects, ranging from innovative technology products to groundbreaking art installations. We&apos;re proud to be a catalyst for creativity and innovation.
              </p>
              <p>
                What sets us apart is our commitment to transparency, security, and community. We carefully review each project to ensure it meets our guidelines, while providing creators with the tools and support they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700/20">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300">We encourage creative thinking and support groundbreaking ideas that push boundaries.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700/20">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Community</h3>
            <p className="text-gray-600 dark:text-gray-300">We build strong connections between creators and backers who share their vision.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700/20">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Trust</h3>
            <p className="text-gray-600 dark:text-gray-300">We maintain the highest standards of security and transparency in all our operations.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl mb-6">Have questions? We&apos;d love to hear from you.</p>
          <button className="bg-white text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/90 px-8 py-3 rounded-full font-semibold">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
} 