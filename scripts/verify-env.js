#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * Run this before deploying to ensure all required environment variables are set
 */

const requiredVars = [
  'ANTHROPIC_API_KEY',
];

const optionalVars = [
  'CLAUDE_MODEL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
];

console.log('🔍 Verifying Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`   ❌ ${varName}: MISSING (required)`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('replace-with')) {
    console.log(`   ⚠️  ${varName}: Set but appears to be placeholder value`);
    hasWarnings = true;
  } else {
    const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
    console.log(`   ✓ ${varName}: ${masked}`);
  }
});

console.log('\n📦 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`   ○ ${varName}: Not set (optional)`);
  } else if (value.includes('your_') || value.includes('replace-with')) {
    console.log(`   ⚠️  ${varName}: Set but appears to be placeholder value`);
  } else {
    console.log(`   ✓ ${varName}: Set`);
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ ERRORS FOUND: Required environment variables are missing!');
  console.log('\nPlease:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Fill in your actual API keys');
  console.log('3. Run this script again\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS: Some variables appear to have placeholder values');
  console.log('   Please verify these are actual API keys before deploying.\n');
  process.exit(0);
} else {
  console.log('✅ All required environment variables are set!');
  console.log('   Ready to deploy to Vercel.\n');
  process.exit(0);
}
