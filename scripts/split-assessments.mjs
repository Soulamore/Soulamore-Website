import fs from 'fs';
import path from 'path';

const inputPath = 'assets/js/assessment-data.js';
const dataDir = 'assets/data/assessments';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const content = fs.readFileSync(inputPath, 'utf8');

const assessments = {};
const assessmentRegex = /window\.SoulamoreAssessments\["([^"]+)"\]\s*=\s*({[\s\S]+?});/g;
let match;

const directory = {};

while ((match = assessmentRegex.exec(content)) !== null) {
    const id = match[1];
    try {
        let objStr = match[2].trim();
        objStr = objStr.replace(/,\s*([}\]])/g, '$1');
        const data = JSON.parse(objStr);
        
        // Save full data to individual file
        fs.writeFileSync(path.join(dataDir, `${id}.json`), JSON.stringify(data, null, 2));
        
        // Save metadata to directory
        directory[id] = {
            id: data.id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            primary_domain: data.primary_domain,
            theme_color: data.theme_color,
            tags: data.tags,
            reviewer_id: data.reviewer_id
        };
    } catch (e) {
        console.error(`Failed to parse ${id}:`, e.message);
    }
}

// Citations
const citationsRegex = /window\.SoulamoreCitations\s*=\s*({[\s\S]+?});/;
const citMatch = content.match(citationsRegex);
if (citMatch) {
    try {
        let objStr = citMatch[1].trim();
        objStr = objStr.replace(/,\s*([}\]])/g, '$1');
        const citations = JSON.parse(objStr);
        fs.writeFileSync('assets/data/citations.json', JSON.stringify(citations, null, 2));
    } catch (e) {
        console.error("Failed to parse citations:", e.message);
    }
}

fs.writeFileSync('assets/data/assessments-directory.json', JSON.stringify(directory, null, 2));
console.log("Successfully split assessments into directory.json and individual files.");
