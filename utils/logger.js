// utils/logger.js - Sistema de logs mejorado
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString('es-CO', { 
    timeZone: 'America/Bogota',
    hour12: false 
  });
};

const logger = {
  info: (message) => {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`);
  },
  
  success: (message) => {
    console.log(`${colors.green}[✓ SUCCESS]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`);
  },
  
  error: (message, error) => {
    console.log(`${colors.red}[✗ ERROR]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`);
    if (error) console.log(colors.red, error, colors.reset);
  },
  
  warn: (message) => {
    console.log(`${colors.yellow}[⚠ WARN]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${message}`);
  },
  
  command: (command, from) => {
    console.log(`${colors.magenta}[COMANDO]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - ${colors.bright}${command}${colors.reset} de ${from}`);
  },
  
  message: (from, isGroup) => {
    const type = isGroup ? '👥 GRUPO' : '💬 PRIVADO';
    console.log(`${colors.blue}[${type}]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} - Mensaje de ${from}`);
  }
};

module.exports = logger;
