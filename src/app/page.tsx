import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5" />
        <div className="max-w-content relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Fund Your Dreams, Build the Future
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Join our community of innovators and backers to bring creative projects to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link 
                href="/start" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-sm"
              >
                Start a Project
              </Link>
              <Link 
                href="/projects" 
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-lg font-medium text-lg shadow-sm"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="max-w-content">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Cards */}
            {[
              {
                title: "Eco-Friendly Water Bottle",
                description: "Revolutionary design that helps reduce plastic waste",
                raised: "$12,450",
                daysLeft: "15"
              },
              {
                title: "Smart Home Garden",
                description: "Automated indoor garden for urban spaces",
                raised: "$28,750",
                daysLeft: "8"
              },
              {
                title: "Educational VR Kit",
                description: "Making learning fun and interactive",
                raised: "$45,890",
                daysLeft: "21"
              }
            ].map((project, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-indigo-500 dark:hover:border-indigo-500">
                <div className="h-48 bg-gray-100 dark:bg-gray-700 group-hover:opacity-90" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{project.raised} raised</span>
                    <span className="text-gray-500 dark:text-gray-400">{project.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-content">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create Your Project",
                description: "Share your story, set your funding goal, and launch your campaign"
              },
              {
                step: 2,
                title: "Spread the Word",
                description: "Share with friends, family, and our supportive community"
              },
              {
                step: 3,
                title: "Get Funded",
                description: "Receive funding and make your project a reality"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg transform -rotate-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
