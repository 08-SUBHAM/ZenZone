import { useState, useEffect } from 'react';

interface MoodData {
  emoji: string;
  label: string;
  count: number;
}

interface MoodMap {
  [key: string]: MoodData;
}

const MoodMeter = () => {
  const [userMood, setUserMood] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<MoodMap>({
    amazing: { emoji: '😊', label: 'Amazing', count: 0 },
    good: { emoji: '🙂', label: 'Good', count: 0 },
    meh: { emoji: '😐', label: 'Meh', count: 0 },
    down: { emoji: '😔', label: 'Down', count: 0 },
    anxious: { emoji: '😰', label: 'Anxious', count: 0 }
  });

  useEffect(() => {
    // Load mood data from localStorage
    const savedMoodData = localStorage.getItem('moodData');
    const savedUserMood = localStorage.getItem('userMood');
    
    if (savedMoodData) {
      setMoodData(JSON.parse(savedMoodData));
    }
    
    if (savedUserMood) {
      setUserMood(savedUserMood);
    }
  }, []);

  const handleMoodSelection = (mood: string) => {
    setMoodData(prevData => {
      const newData = { ...prevData };
      
      if (userMood) {
        newData[userMood].count--;
      }
      
      newData[mood].count++;
      
      // Save to localStorage
      localStorage.setItem('moodData', JSON.stringify(newData));
      localStorage.setItem('userMood', mood);
      
      return newData;
    });
    
    setUserMood(mood);
  };

  const currentMoodData = userMood ? moodData[userMood] : { emoji: '😌', label: 'Chill', count: 42 };

  return (
    <section className="mood-meter py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Community Vibes</h2>
        <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="mood-display flex items-center gap-4">
              <div className="mood-emoji text-5xl">
                {currentMoodData.emoji}
              </div>
              <div className="mood-text">
                <p className="text-lg font-medium">
                  Current Community Mood: <span className="text-primary-600">{currentMoodData.label}</span>
                </p>
                <p className="text-gray-600">
                  <span>{currentMoodData.count}</span> people feeling this way right now
                </p>
              </div>
            </div>
            <div className="mood-actions">
              <p className="text-gray-700 mb-3">How are you feeling today?</p>
              <div className="mood-buttons grid grid-cols-5 gap-3">
                {Object.entries(moodData).map(([key, { emoji }]) => (
                  <button
                    key={key}
                    className={`mood-btn ${userMood === key ? 'bg-primary-50 shadow-lg ring-2 ring-primary-500' : ''}`}
                    onClick={() => handleMoodSelection(key)}
                    aria-label={`Select mood: ${key}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodMeter; 