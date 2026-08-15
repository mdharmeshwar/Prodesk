import { motion } from 'framer-motion';

const AuthCard = ({ title, subtitle, children, accent, footer }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className="auth-card"
  >
    <div className="auth-card__glow" style={{ background: accent }} />
    <div className="auth-card__header">
      <span className="eyebrow">Secure access</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>

    {children}

    {footer && <div className="auth-card__footer">{footer}</div>}
  </motion.section>
);

export default AuthCard;
