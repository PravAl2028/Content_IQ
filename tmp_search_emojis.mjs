import fs from 'fs';
import path from 'path';

function searchEmojis(dir, results) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== 'public') {
                searchEmojis(fullPath, results);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu;

            // Let's just catch anything in the unicode blocks for emojis that are commonly used
            const altRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu;
            const matches = content.match(altRegex);
            if (matches) {
                results.push({ file: fullPath, emojis: [...new Set(matches)] });
            }
        }
    }
}

const results = [];
searchEmojis(path.join(process.cwd(), 'app'), results);
if (fs.existsSync(path.join(process.cwd(), 'components'))) {
    searchEmojis(path.join(process.cwd(), 'components'), results);
}

fs.writeFileSync('emojis.json', JSON.stringify(results, null, 2));
console.log('Done');
