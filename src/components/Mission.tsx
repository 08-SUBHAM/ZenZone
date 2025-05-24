import { useEffect, useState } from 'react';

interface StatItem {
  label: string;
  value: string;
  countTo?: number;
}

const Mission = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Community Members', value: '0', countTo: 10000 },
    { label: 'Active Daily', value: '0', countTo: 500 },
    { label: 'Support Available', value: '24/7' }
  ]);

  useEffect(() => {
    stats.forEach((stat, index) => {
      if (stat.countTo) {
        animateValue(index, 0, stat.countTo, 2000);
      }
    });
  }, []);

  const animateValue = (index: number, start: number, end: number, duration: number) => {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);

    const startTime = new Date().getTime();
    const endTime = startTime + duration;

    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * range));
      
      setStats(prevStats => {
        const newStats = [...prevStats];
        newStats[index] = { ...newStats[index], value: value.toLocaleString() };
        return newStats;
      });

      if (value < end) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  };

  return (
    <section className="mission py-20 bg-white" id="about">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-subtitle">Our Mission</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              You're Not Alone in This Journey
            </h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              ZenZone was born from a simple idea: no one should have to face mental health challenges alone. 
              We're building a community where vulnerability is strength, and support is always within reach. 
              Whether you're looking for resources, connection, or just someone who gets it - we're here for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission; 