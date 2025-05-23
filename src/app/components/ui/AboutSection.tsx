import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Future of DeFi Vaults
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our innovative vault manager combines dynamic risk protection with automated yield strategies, 
            giving you the power to maximize your Bitcoin holdings while maintaining full control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-3">Dynamic Risk Protection</h3>
            <p className="text-gray-400">
              Our smart contracts automatically adjust collateral ratios based on market volatility, 
              protecting you from unexpected liquidations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-3">Automated Yield</h3>
            <p className="text-gray-400">
              Your deposited BTC automatically earns yield through carefully selected DeFi strategies, 
              while you maintain the option to borrow against it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-3">Starknet Powered</h3>
            <p className="text-gray-400">
              Built on Starknet for lightning-fast transactions and minimal fees, 
              with real-time price feeds from Pragma and lending protocols from Vesu.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Built by DeFi Innovators</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our team combines years of experience in traditional finance with cutting-edge blockchain technology. 
            We're passionate about making DeFi accessible, safe, and profitable for everyone.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 