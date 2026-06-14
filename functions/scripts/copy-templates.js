const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../resources/email-templates');
const destDir = path.join(__dirname, '../src/templates');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Copying email templates from resources/email-templates to functions/src/templates...');
try {
  if (!fs.existsSync(srcDir)) {
    console.warn('⚠️ Source directory resources/email-templates does not exist. Skipping copy.');
    process.exit(0);
  }
  copyRecursiveSync(srcDir, destDir);
  console.log('✅ Templates copied successfully.');
} catch (err) {
  console.error('❌ Failed to copy templates:', err.message);
  process.exit(1);
}
