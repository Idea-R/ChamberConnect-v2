#!/usr/bin/env node

/**
 * ChamberConnect Development Environment Setup Script
 * 
 * This script sets up the development environment with all necessary
 * dependencies, configurations, and tools for scalable development.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper functions
const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);
const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);
const logStep = (message) => log(`🔄 ${message}`, colors.cyan);

// Configuration
const PROJECT_ROOT = process.cwd();
const REQUIRED_NODE_VERSION = '18.0.0';
const REQUIRED_NPM_VERSION = '9.0.0';

/**
 * Check system requirements
 */
function checkSystemRequirements() {
  logStep('Checking system requirements...');
  
  try {
    // Check Node.js version
    const nodeVersion = process.version.slice(1);
    if (compareVersions(nodeVersion, REQUIRED_NODE_VERSION) < 0) {
      logError(`Node.js ${REQUIRED_NODE_VERSION} or higher is required. Current: ${nodeVersion}`);
      process.exit(1);
    }
    
    // Check npm version
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    if (compareVersions(npmVersion, REQUIRED_NPM_VERSION) < 0) {
      logWarning(`npm ${REQUIRED_NPM_VERSION} or higher is recommended. Current: ${npmVersion}`);
    }
    
    // Check if Expo CLI is installed
    try {
      execSync('npx expo --version', { stdio: 'ignore' });
      logSuccess('Expo CLI is available');
    } catch (error) {
      logWarning('Expo CLI not found globally, will use npx');
    }
    
    logSuccess('System requirements check passed');
  } catch (error) {
    logError(`System requirements check failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Compare version strings
 */
function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  
  return 0;
}

/**
 * Create directory structure
 */
function createDirectoryStructure() {
  logStep('Creating directory structure...');
  
  const directories = [
    'src/config',
    'src/services/api',
    'src/services/auth',
    'src/services/chamber',
    'src/services/business',
    'src/services/messaging',
    'src/services/utils',
    'src/services/errors',
    'src/stores',
    'src/components/ui',
    'src/components/forms',
    'src/components/charts',
    'src/screens/auth',
    'src/screens/chamber',
    'src/screens/business',
    'src/screens/messaging',
    'src/hooks',
    'src/types',
    'src/utils',
    'tests/unit',
    'tests/integration',
    'tests/e2e',
    'docs/api',
    'docs/components',
    'scripts',
    'assets/icons',
    'assets/images',
    'assets/fonts',
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      logInfo(`Created directory: ${dir}`);
    }
  });
  
  logSuccess('Directory structure created');
}

/**
 * Setup environment configuration
 */
function setupEnvironmentConfig() {
  logStep('Setting up environment configuration...');
  
  const envExamplePath = path.join(PROJECT_ROOT, 'env.example');
  const envPath = path.join(PROJECT_ROOT, '.env');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    logSuccess('Created .env file from env.example');
    logWarning('Please update .env file with your actual configuration values');
  } else if (fs.existsSync(envPath)) {
    logInfo('.env file already exists');
  } else {
    logWarning('No env.example file found to copy');
  }
}

/**
 * Install dependencies
 */
function installDependencies() {
  logStep('Installing dependencies...');
  
  try {
    logInfo('Installing npm dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: PROJECT_ROOT });
    
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError(`Failed to install dependencies: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Setup development tools
 */
function setupDevelopmentTools() {
  logStep('Setting up development tools...');
  
  // Setup Husky for git hooks
  try {
    logInfo('Setting up Husky git hooks...');
    execSync('npx husky install', { stdio: 'inherit', cwd: PROJECT_ROOT });
    
    // Create pre-commit hook
    const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:fix
npm run type-check
`;
    
    const huskyDir = path.join(PROJECT_ROOT, '.husky');
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitHook);
    logSuccess('Husky git hooks configured');
  } catch (error) {
    logWarning(`Failed to setup Husky: ${error.message}`);
  }
  
  // Setup ESLint configuration
  const eslintConfig = {
    extends: [
      'expo',
      '@react-native-community',
      'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint', 'react-hooks'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  };
  
  const eslintPath = path.join(PROJECT_ROOT, '.eslintrc.js');
  if (!fs.existsSync(eslintPath)) {
    fs.writeFileSync(
      eslintPath,
      `module.exports = ${JSON.stringify(eslintConfig, null, 2)};`
    );
    logSuccess('ESLint configuration created');
  }
}

/**
 * Create initial configuration files
 */
function createConfigurationFiles() {
  logStep('Creating configuration files...');
  
  // Create Babel configuration
  const babelConfig = {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/services': './src/services',
            '@/stores': './src/stores',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/config': './src/config',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
  
  const babelPath = path.join(PROJECT_ROOT, 'babel.config.js');
  if (!fs.existsSync(babelPath)) {
    fs.writeFileSync(
      babelPath,
      `module.exports = ${JSON.stringify(babelConfig, null, 2)};`
    );
    logSuccess('Babel configuration created');
  }
  
  // Create Metro configuration
  const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Enable symlinks
config.resolver.unstable_enableSymlinks = true;

module.exports = config;`;
  
  const metroPath = path.join(PROJECT_ROOT, 'metro.config.js');
  if (!fs.existsSync(metroPath)) {
    fs.writeFileSync(metroPath, metroConfig);
    logSuccess('Metro configuration created');
  }
}

/**
 * Setup testing framework
 */
function setupTesting() {
  logStep('Setting up testing framework...');
  
  // Create Jest configuration
  const jestConfig = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
      '<rootDir>/tests/**/*.{js,jsx,ts,tsx}',
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/index.{js,jsx,ts,tsx}',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };
  
  const jestPath = path.join(PROJECT_ROOT, 'jest.config.js');
  if (!fs.existsSync(jestPath)) {
    fs.writeFileSync(
      jestPath,
      `module.exports = ${JSON.stringify(jestConfig, null, 2)};`
    );
    logSuccess('Jest configuration created');
  }
  
  // Create test setup file
  const testSetup = `import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
  },
}));`;
  
  const testSetupPath = path.join(PROJECT_ROOT, 'tests/setup.js');
  if (!fs.existsSync(testSetupPath)) {
    fs.writeFileSync(testSetupPath, testSetup);
    logSuccess('Test setup file created');
  }
}

/**
 * Verify installation
 */
function verifyInstallation() {
  logStep('Verifying installation...');
  
  try {
    // Check if TypeScript compilation works
    logInfo('Checking TypeScript compilation...');
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: PROJECT_ROOT });
    logSuccess('TypeScript compilation successful');
    
    // Check if linting works
    logInfo('Checking ESLint...');
    execSync('npm run lint', { stdio: 'pipe', cwd: PROJECT_ROOT });
    logSuccess('ESLint check passed');
    
    // Check if tests can run
    logInfo('Checking test setup...');
    execSync('npm test -- --passWithNoTests', { stdio: 'pipe', cwd: PROJECT_ROOT });
    logSuccess('Test setup verified');
    
    logSuccess('Installation verification completed');
  } catch (error) {
    logWarning('Some verification checks failed, but setup is likely complete');
    logInfo('You can manually run the following commands to verify:');
    logInfo('  npm run type-check');
    logInfo('  npm run lint');
    logInfo('  npm test');
  }
}

/**
 * Print next steps
 */
function printNextSteps() {
  log('\n' + '='.repeat(60), colors.bright);
  log('🎉 ChamberConnect Development Environment Setup Complete!', colors.green);
  log('='.repeat(60), colors.bright);
  
  log('\n📋 Next Steps:', colors.bright);
  log('1. Update your .env file with actual configuration values', colors.cyan);
  log('2. Set up your Supabase project and update the credentials', colors.cyan);
  log('3. Run the development server: npm run dev', colors.cyan);
  log('4. Start coding your scalable chamber management app! 🚀', colors.cyan);
  
  log('\n🛠️  Available Commands:', colors.bright);
  log('  npm run dev          - Start development server', colors.yellow);
  log('  npm run dev:web      - Start web development server', colors.yellow);
  log('  npm run dev:ios      - Start iOS development server', colors.yellow);
  log('  npm run dev:android  - Start Android development server', colors.yellow);
  log('  npm run build:web    - Build for web', colors.yellow);
  log('  npm run lint         - Run ESLint', colors.yellow);
  log('  npm run lint:fix     - Fix ESLint issues', colors.yellow);
  log('  npm run type-check   - Check TypeScript types', colors.yellow);
  log('  npm run test         - Run tests', colors.yellow);
  log('  npm run test:watch   - Run tests in watch mode', colors.yellow);
  log('  npm run test:coverage - Run tests with coverage', colors.yellow);
  
  log('\n📚 Documentation:', colors.bright);
  log('  Architecture Plan: logs/scalable_architecture_plan.md', colors.magenta);
  log('  Environment Config: env.example', colors.magenta);
  log('  Development Roadmap: logs/development_roadmap.md', colors.magenta);
  
  log('\n💡 Pro Tips:', colors.bright);
  log('  - Use the path aliases (@/components, @/services, etc.)', colors.green);
  log('  - Follow the established folder structure', colors.green);
  log('  - Write tests for your components and services', colors.green);
  log('  - Use the logging service for debugging', colors.green);
  log('  - Leverage the error handling system', colors.green);
  
  log('\n🔗 Useful Links:', colors.bright);
  log('  - Expo Documentation: https://docs.expo.dev/', colors.blue);
  log('  - React Native: https://reactnative.dev/', colors.blue);
  log('  - Supabase: https://supabase.com/docs', colors.blue);
  log('  - TypeScript: https://www.typescriptlang.org/docs/', colors.blue);
  
  log('\nHappy coding! 🎯\n', colors.bright);
}

/**
 * Main setup function
 */
function main() {
  log('🚀 ChamberConnect Development Environment Setup', colors.bright);
  log('Setting up enterprise-grade scalable architecture...\n', colors.cyan);
  
  try {
    checkSystemRequirements();
    createDirectoryStructure();
    setupEnvironmentConfig();
    installDependencies();
    setupDevelopmentTools();
    createConfigurationFiles();
    setupTesting();
    verifyInstallation();
    printNextSteps();
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkSystemRequirements,
  createDirectoryStructure,
  setupEnvironmentConfig,
  installDependencies,
  setupDevelopmentTools,
  createConfigurationFiles,
  setupTesting,
  verifyInstallation,
}; 