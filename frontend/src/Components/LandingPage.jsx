import { Link } from 'react-router-dom';
import { 
  BellAlertIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import LiquidEther from './LiquidEther';

const LandingPage = () => {
  const features = [
    {
      icon: BellAlertIcon,
      title: 'Smart Reminders',
      description: 'Never miss a payment with intelligent notifications before renewal dates.'
    },
    {
      icon: CalendarIcon,
      title: 'Track Everything',
      description: 'Manage all your subscriptions in one beautiful, organized dashboard.'
    },
    {
      icon: CreditCardIcon,
      title: 'Cost Analysis',
      description: 'See exactly how much you\'re spending monthly and yearly on subscriptions.'
    },
    {
      icon: ChartBarIcon,
      title: 'Insights & Reports',
      description: 'Get detailed analytics about your subscription spending patterns.'
    }
  ];

  const benefits = [
    'Unlimited subscription tracking',
    'Email notifications before renewals',
    'Beautiful, intuitive interface',
    'Secure data encryption',
    'Cross-device synchronization',
    'Detailed spending analytics'
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <LiquidEther />

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="Logo"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Subscription Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Free Forever
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Take Control of Your
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Subscriptions
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Track, manage, and optimize all your subscriptions in one place. 
            Never miss a payment or renewal date again.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center"
            >
              Start Free Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Free to Use</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Access Anytime</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Unlimited Subscriptions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features to manage your subscriptions effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Why Choose Subscription Manager?
              </h2>
              <p className="text-xl text-primary-100">
                Join thousands managing their subscriptions smarter
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all"
                >
                  <CheckCircleIcon className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-primary-600 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Get Started for Free
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join now and take control of your subscription spending today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold rounded-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-500/50"
          >
            Create Your Free Account
            <ArrowRightIcon className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 Subscription Manager. Built with ❤️ for better subscription management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
