import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fund Your Dreams, Build the Future
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join our community of innovators and backers to bring creative projects to life.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/start" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg">
                Start a Project
              </Link>
              <Link href="/projects" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Project Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Eco-Friendly Water Bottle</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Revolutionary design that helps reduce plastic waste</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">$12,450 raised</span>
                  <span className="text-gray-500 dark:text-gray-400">15 days left</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Home Garden</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Automated indoor garden for urban spaces</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">$28,750 raised</span>
                  <span className="text-gray-500 dark:text-gray-400">8 days left</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Educational VR Kit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Making learning fun and interactive</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">$45,890 raised</span>
                  <span className="text-gray-500 dark:text-gray-400">21 days left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Create Your Project</h3>
              <p className="text-gray-600 dark:text-gray-300">Share your story, set your funding goal, and launch your campaign</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Spread the Word</h3>
              <p className="text-gray-600 dark:text-gray-300">Share with friends, family, and our supportive community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Get Funded</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive funding and make your project a reality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
