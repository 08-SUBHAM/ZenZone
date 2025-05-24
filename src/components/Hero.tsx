import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero min-h-screen flex items-center bg-gradient-to-br from-primary-50 to-white" id="home">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Mental Health Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Join a supportive community that understands. Get 24/7 access to resources, tools, and people who care about your wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="cta-button w-full sm:w-auto">
              Join Free
            </Link>
            <a href="#features" className="cta-button secondary w-full sm:w-auto">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 