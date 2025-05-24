import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCommentDots, 
  faRobot, 
  faUserMd, 
  faComments, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
  linkText: string;
  linkHref: string;
  featured?: boolean;
  badge?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  benefits, 
  linkText, 
  linkHref, 
  featured, 
  badge 
}: FeatureCardProps) => {
  return (
    <div className={`feature-card ${featured ? 'featured' : ''}`}>
      <div className="card-content">
        <div className="feature-icon">
          <FontAwesomeIcon icon={icon} className="text-2xl" />
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="feature-benefits space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <FontAwesomeIcon icon={faCheckCircle} className="text-primary-500 mr-2" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <a href={linkHref} className="feature-link inline-flex items-center text-primary-600 hover:text-primary-700">
        {linkText} <span className="ml-2">→</span>
      </a>
      {badge && <div className="feature-badge">{badge}</div>}
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: faCommentDots,
      title: 'AI Chat Companion',
      description: 'Get instant support from our AI companion, available 24/7 to listen, provide guidance, and help you find resources.',
      benefits: [
        'Always available, day or night',
        'Non-judgmental listening',
        'Personalized coping strategies'
      ],
      linkText: 'Start Chatting',
      linkHref: '#chatbot'
    },
    {
      icon: faRobot,
      title: 'AI Therapist',
      description: 'Experience AI-powered therapy with our advanced virtual therapist, designed to provide cognitive behavioral therapy techniques.',
      benefits: [
        'CBT-based therapy sessions',
        'Mood tracking & insights',
        'Personalized therapy plans'
      ],
      linkText: 'Start Therapy',
      linkHref: '#ai-therapist',
      featured: true,
      badge: 'New'
    },
    {
      icon: faUserMd,
      title: '24/7 Health Experts',
      description: 'Connect with licensed mental health professionals whenever you need expert guidance and support.',
      benefits: [
        'Licensed therapists & counselors',
        'Secure video/chat sessions',
        'Prescription services available'
      ],
      linkText: 'Talk to an Expert',
      linkHref: '#experts',
      featured: true,
      badge: 'Most Popular'
    },
    {
      icon: faComments,
      title: 'Support Forums',
      description: 'Join our safe, moderated community to share experiences and find support from others on similar journeys.',
      benefits: [
        'Anonymous posting available',
        'Topic-specific groups',
        '24/7 community support'
      ],
      linkText: 'Join the Conversation',
      linkHref: '#forums'
    }
  ];

  return (
    <section className="features py-20 bg-gray-50" id="features">
      <div className="container">
        <div className="section-title">
          <span className="section-subtitle">How We Can Help</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Your Mental Health Support System</h2>
          <p className="section-description">
            Comprehensive support options designed to be there for you, whenever and however you need it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <div className="features-cta mt-16 text-center">
          <p className="text-xl text-gray-600 mb-6">
            Not sure where to start? Take our quick assessment to find the best support option for you.
          </p>
          <a href="#assessment" className="cta-button">
            Take Assessment
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features; 