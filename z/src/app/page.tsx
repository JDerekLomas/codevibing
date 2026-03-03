'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '@/components/Slide';
import { Navigation } from '@/components/Navigation';
import { Slide as SlideType } from '@/components/types';
import { Brain, Heart, Users, Sparkles, Target, Zap, Shield, Compass, Lightbulb, Rocket } from 'lucide-react';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideType[] = [
    {
      id: '0',
      title: 'Designing AI Agents for Human Flourishing',
      content: (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Designing <span className="gradient-text">AI Agents</span> for<br />
              <span className="gradient-text">Human Flourishing</span>
            </h1>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Creating artificial intelligence that enhances human potential, wellbeing, and collective progress
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <Brain className="w-16 h-16 text-white/80 mx-auto mb-3 floating" />
              <p className="text-white/80">Intelligence</p>
            </div>
            <div className="text-center">
              <Heart className="w-16 h-16 text-white/80 mx-auto mb-3 floating" style={{ animationDelay: '1s' }} />
              <p className="text-white/80">Empathy</p>
            </div>
            <div className="text-center">
              <Users className="w-16 h-16 text-white/80 mx-auto mb-3 floating" style={{ animationDelay: '2s' }} />
              <p className="text-white/80">Connection</p>
            </div>
          </motion.div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '1',
      title: 'The Challenge',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">The Challenge</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="text-red-300 mb-4">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Current AI Focus</h3>
              <ul className="space-y-3 text-white/90">
                <li>• Task optimization</li>
                <li>• Efficiency gains</li>
                <li>• Cost reduction</li>
                <li>• Automation</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="text-green-300 mb-4">
                <Target className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Human Flourishing</h3>
              <ul className="space-y-3 text-white/90">
                <li>• Meaning & purpose</li>
                <li>• Personal growth</li>
                <li>• Social connection</li>
                <li>• Wellbeing</li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-white/90 mt-12 max-w-4xl"
          >
            How can we design AI agents that go beyond productivity to truly enhance human flourishing?
          </motion.p>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '2',
      title: 'Rethinking the Relationship',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">Rethinking the Relationship</h2>

          <div className="space-y-12 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10"
            >
              <h3 className="text-3xl font-semibold gradient-text mb-6">From Tool to Partner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl text-white/80 mb-4">Traditional Approach</h4>
                  <p className="text-white/70 leading-relaxed">
                    AI as a passive tool that executes commands and optimizes predefined tasks
                  </p>
                </div>
                <div>
                  <h4 className="text-xl text-white/80 mb-4">Flourishing Approach</h4>
                  <p className="text-white/70 leading-relaxed">
                    AI as an active partner that understands human values and supports growth
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-10"
            >
              <h3 className="text-3xl font-semibold gradient-text mb-6">Core Principles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                  <p className="text-white/90">Autonomy</p>
                </div>
                <div className="text-center">
                  <Compass className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-white/90">Guidance</p>
                </div>
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
                  <p className="text-white/90">Discovery</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-red-300 mx-auto mb-3" />
                  <p className="text-white/90">Empathy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '3',
      title: 'Key Design Pillars',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">Key Design Pillars</h2>

          <div className="space-y-6 max-w-6xl">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Human-Centered Values',
                description: 'Design AI that aligns with human values, ethics, and cultural contexts',
                color: 'text-blue-300'
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Cognitive Enhancement',
                description: 'Augment human intelligence without replacing human judgment',
                color: 'text-purple-300'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Emotional Intelligence',
                description: 'Understand and respond to human emotions with empathy and care',
                color: 'text-pink-300'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Creative Partnership',
                description: 'Collaborate with humans to unlock new forms of creativity and innovation',
                color: 'text-yellow-300'
              }
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="glass-card rounded-2xl p-8 flex items-center gap-6"
              >
                <div className={pillar.color}>{pillar.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-3">{pillar.title}</h3>
                  <p className="text-white/80 text-lg">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '4',
      title: 'Implementation Framework',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">Implementation Framework</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            {[
              {
                step: '01',
                title: 'Discovery',
                items: ['User research', 'Value mapping', 'Context analysis'],
                icon: <Compass className="w-8 h-8" />
              },
              {
                step: '02',
                title: 'Design',
                items: ['Ethical guidelines', 'Interaction patterns', 'Feedback loops'],
                icon: <Lightbulb className="w-8 h-8" />
              },
              {
                step: '03',
                title: 'Iteration',
                items: ['Continuous learning', 'Human oversight', 'Adaptive improvement'],
                icon: <Rocket className="w-8 h-8" />
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="text-6xl font-bold text-white/30 mb-4">{phase.step}</div>
                <div className="text-white/80 mb-6 flex justify-center">{phase.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-6">{phase.title}</h3>
                <ul className="space-y-3 text-left">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-white/80 flex items-start gap-2">
                      <span className="text-green-400 mt-1">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '5',
      title: 'Real-World Applications',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">Real-World Applications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold gradient-text mb-6">Education</h3>
              <div className="space-y-4 text-white/80">
                <p>• Personalized learning companions</p>
                <p>• Adaptive skill development</p>
                <p>• Creative problem-solving partners</p>
                <p>• Emotional support for learning challenges</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold gradient-text mb-6">Healthcare</h3>
              <div className="space-y-4 text-white/80">
                <p>• Mental wellness companions</p>
                <p>• Personalized health coaching</p>
                <p>• Preventive care guidance</p>
                <p>• Empathetic patient support</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold gradient-text mb-6">Work & Career</h3>
              <div className="space-y-4 text-white/80">
                <p>• Professional development guides</p>
                <p>• Work-life balance coaching</p>
                <p>• Skill-building assistants</p>
                <p>• Team collaboration enhancers</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold gradient-text mb-6">Personal Growth</h3>
              <div className="space-y-4 text-white/80">
                <p>• Life coaching companions</p>
                <p>• Creative expression partners</p>
                <p>• Mindfulness and reflection aids</p>
                <p>• Relationship building support</p>
              </div>
            </motion.div>
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '6',
      title: 'Ethical Considerations',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">Ethical Considerations</h2>

          <div className="max-w-5xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-10"
            >
              <h3 className="text-3xl font-semibold text-yellow-300 mb-6">Critical Questions</h3>
              <div className="space-y-4">
                {[
                  'How do we ensure AI respects human autonomy?',
                  'What safeguards prevent dependency and manipulation?',
                  'How do we maintain human judgment and decision-making?',
                  'How do we address bias and ensure inclusivity?',
                  'What transparency is needed for trust?'
                ].map((question, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl">•</span>
                    <p className="text-white/90 text-lg">{question}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-10"
            >
              <h3 className="text-3xl font-semibold text-green-300 mb-6">Guiding Principles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl text-white/80 mb-3">Do No Harm</h4>
                  <p className="text-white/70">Prioritize human wellbeing above all else</p>
                </div>
                <div>
                  <h4 className="text-xl text-white/80 mb-3">Respect Dignity</h4>
                  <p className="text-white/70">Treat all humans with inherent worth</p>
                </div>
                <div>
                  <h4 className="text-xl text-white/80 mb-3">Promote Justice</h4>
                  <p className="text-white/70">Ensure equitable access and outcomes</p>
                </div>
                <div>
                  <h4 className="text-xl text-white/80 mb-3">Foster Growth</h4>
                  <p className="text-white/70">Enable human potential and development</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '7',
      title: 'The Path Forward',
      content: (
        <div className="space-y-8">
          <h2 className="text-6xl font-bold text-white mb-8">The Path Forward</h2>

          <div className="space-y-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <Rocket className="w-20 h-20 text-white/80 mx-auto mb-6 floating" />
              <h3 className="text-4xl font-bold gradient-text mb-6">A Vision for Tomorrow</h3>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                AI agents that don't just make us more productive, but help us become more human—
                more creative, more connected, more compassionate, more fulfilled.
              </p>
              <p className="text-lg text-white/80 italic">
                "The question isn't whether AI will change humanity, but how we can guide that change
                to enhance human flourishing rather than diminish it."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="text-center glass-card rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Start Small</h4>
                <p className="text-white/80">Focus on specific human needs and contexts</p>
              </div>
              <div className="text-center glass-card rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Iterate Often</h4>
                <p className="text-white/80">Learn from human feedback and adaptation</p>
              </div>
              <div className="text-center glass-card rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Measure Impact</h4>
                <p className="text-white/80">Assess flourishing, not just performance</p>
              </div>
            </motion.div>
          </div>
        </div>
      ),
      layout: 'center'
    },
    {
      id: '8',
      title: 'Thank You',
      content: (
        <div className="space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold gradient-text mb-6">Thank You</h1>
            <p className="text-3xl text-white/90 mb-12">Let's build AI that helps humanity flourish</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-10 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Join the Conversation</h3>
            <div className="space-y-4 text-white/80">
              <p className="text-lg">• Share your thoughts on human-centered AI</p>
              <p className="text-lg">• Contribute to ethical AI development</p>
              <p className="text-lg">• Help shape the future of AI-human partnership</p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-6 border-t border-white/20"
            >
              <Sparkles className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white/60 italic">
                The future of AI is not something that happens to us—
                it's something we create together.
              </p>
            </motion.div>
          </motion.div>
        </div>
      ),
      layout: 'center'
    }
  ];

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  };

  const handleGoToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <AnimatePresence mode="wait">
        <Slide key={currentSlide} slide={slides[currentSlide]} isActive={true} />
      </AnimatePresence>

      <Navigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToSlide={handleGoToSlide}
      />

      <div className="fixed top-8 right-8 glass-card rounded-full px-6 py-3">
        <p className="text-white/80 font-medium">
          {currentSlide + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
}