import { motion } from 'framer-motion';
import { useState } from 'react';

const steps = [
  {
    id: 1,
    title: 'Deposit BTC',
    description: 'Start by depositing your Bitcoin to begin earning yield',
    action: 'deposit' as const,
    icon: '📥',
    color: 'from-blue-500 to-blue-700',
    position: { x: 0, y: 0 }
  },
  {
    id: 2,
    title: 'Earn Yield',
    description: 'Your BTC automatically earns yield through optimized strategies',
    action: null,
    icon: '📈',
    color: 'from-green-500 to-green-700',
    position: { x: 1, y: 0 }
  },
  {
    id: 3,
    title: 'Borrow USDC',
    description: 'Borrow USDC against your deposited Bitcoin',
    action: 'borrow' as const,
    icon: '💵',
    color: 'from-purple-500 to-purple-700',
    position: { x: 0, y: 1 }
  },
  {
    id: 4,
    title: 'Manage Position',
    description: 'Repay loans or withdraw your Bitcoin anytime',
    action: 'repay' as const,
    icon: '⚙️',
    color: 'from-orange-500 to-orange-700',
    position: { x: 1, y: 1 }
  }
];

export default function AnimatedGuide() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (step: typeof steps[0]) => {
    setCurrentStep(step.id);
    if (step.action) {
      alert(`Use the circle next to "Stack Sats Smarter" to perform ${step.action} action`);
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow our interactive guide to understand how to maximize your Bitcoin holdings
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* Horizontal connection */}
            <motion.line
              x1="25%" y1="25%" x2="75%" y2="25%"
              stroke="url(#connection-gradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentStep >= 2 ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Vertical connections */}
            <motion.line
              x1="25%" y1="25%" x2="25%" y2="75%"
              stroke="url(#connection-gradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentStep >= 3 ? 1 : 0 }}
              transition={{ duration: 1, delay: 1 }}
            />
            
            <motion.line
              x1="75%" y1="25%" x2="75%" y2="75%"
              stroke="url(#connection-gradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentStep >= 4 ? 1 : 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
          </svg>

          {/* Grid of steps */}
          <div className="grid grid-cols-2 gap-8 md:gap-16 relative" style={{ zIndex: 2 }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredStep(step.id)}
                  onHoverEnd={() => setHoveredStep(null)}
                  onClick={() => handleStepClick(step)}
                  className={`
                    relative overflow-hidden rounded-2xl p-8 cursor-pointer
                    bg-gradient-to-br ${step.color}
                    transform transition-all duration-300
                    ${hoveredStep === step.id ? 'shadow-2xl shadow-blue-500/25' : 'shadow-xl'}
                    ${currentStep === step.id ? 'ring-4 ring-blue-400/50' : ''}
                    ${step.action ? 'hover:shadow-2xl' : 'opacity-75'}
                  `}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                    <p className="text-white/90 text-sm">{step.description}</p>
                    
                    {step.action && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredStep === step.id ? 1 : 0 }}
                        className="absolute top-4 right-4"
                      >
                        <span className="text-white/80 text-sm">Click to try!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Step number */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{step.id}</span>
                  </div>

                  {/* Pulse animation for current step */}
                  {currentStep === step.id && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl border-2 border-white/30"
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="flex space-x-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === step.id 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 