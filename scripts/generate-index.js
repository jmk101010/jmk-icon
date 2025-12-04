import fs from 'fs';
import path from 'path';

const iconsDir = path.resolve('src/icons');
const indexPath = path.resolve('src/index.ts');

try {
  const files = fs.readdirSync(iconsDir);

  const indexContent = files
    .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
    .map(file => {
      const componentName = path.basename(file, '.tsx');
      // Create a valid identifier by removing hyphens and handling leading numbers
      let validComponentName = componentName.replace(/-/g, '');
      
      // If the component name starts with a number, prefix it with "Icon"
      if (/^[0-9]/.test(validComponentName)) {
        validComponentName = `Icon${validComponentName}`;
      }

      return `export { default as ${validComponentName} } from './icons/${componentName}';`;
    })
    .join('\n');

  fs.writeFileSync(indexPath, indexContent);

  console.log('Successfully generated src/index.ts');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('src/icons directory not found. Skipping index generation. This is normal on first run.');
    // Create an empty index file so rollup doesn't fail
    fs.writeFileSync(indexPath, '// This file is auto-generated.\n');
  } else {
    console.error('Error generating src/index.ts:', error);
    process.exit(1);
  }
}