const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src/app/components/ui');

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Xóa tất cả @version trong import
  content = content.replace(/@\d+\.\d+\.\d+/g, '');
  content = content.replace(/@\d+\.\d+/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImports(filePath);
    }
  }
}

console.log('🔧 Fixing imports in UI components...');
walkDir(uiDir);
console.log('✅ Done!');