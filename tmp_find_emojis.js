const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];
const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

function walkSync(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
                const content = fs.readFileSync(filePath, 'utf8');
                let match;
                const matches = [];
                while ((match = emojiRegex.exec(content)) !== null) {
                    // Skip common false positives if any, or just log
                    matches.push({ char: match[0], index: match.index });
                }

                if (matches.length > 0) {
                    // get unique emojis
                    const uniqueEmojis = [...new Set(matches.map(m => m.char))];
                    console.log(`\nFile: ${filePath}`);
                    console.log(`Emojis found: ${uniqueEmojis.join(', ')}`);

                    // print context
                    const lines = content.split('\n');
                    for (let match of matches) {
                        const lineContent = content.substring(0, match.index);
                        const lineNumber = lineContent.split('\n').length;
                        if (lines[lineNumber - 1].trim().startsWith('//')) continue;
                        console.log(`  Line ${lineNumber}: ${lines[lineNumber - 1].trim()}`);
                    }
                }
            }
        } else if (stat.isDirectory()) {
            walkSync(filePath);
        }
    });
}

directories.forEach(dir => {
    const fullPath = path.join('C:\\Users\\Hazari Nikhil\\ContentIQ', dir);
    if (fs.existsSync(fullPath)) {
        walkSync(fullPath);
    }
});
