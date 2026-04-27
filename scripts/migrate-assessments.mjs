import fs from 'fs';

// This is a bit hacky but we want to extract the JSON-like objects from the JS file
const content = fs.readFileSync('assets/js/assessment-data.js', 'utf8');

// Use regex to find the assignments
const assessments = {};
const citations = {};

// Find window.SoulamoreAssessments["key"] = { ... }
const assessmentRegex = /window\.SoulamoreAssessments\["([^"]+)"\]\s*=\s*({[\s\S]+?});/g;
let match;
while ((match = assessmentRegex.exec(content)) !== null) {
    try {
        // Evaluate the object string loosely (it's mostly JSON but might have some JS quirks)
        // For safety in this script, we'll try to parse it as JSON after some cleaning
        let objStr = match[2].trim();
        // Remove trailing commas if any
        objStr = objStr.replace(/,\s*([}\]])/g, '$1');
        assessments[match[1]] = JSON.parse(objStr);
    } catch (e) {
        console.error(`Failed to parse assessment ${match[1]}:`, e.message);
    }
}

// Find window.SoulamoreCitations = { ... }
const citationsRegex = /window\.SoulamoreCitations\s*=\s*({[\s\S]+?});/;
const citMatch = content.match(citationsRegex);
if (citMatch) {
    try {
        let objStr = citMatch[1].trim();
        objStr = objStr.replace(/,\s*([}\]])/g, '$1');
        // Citations might have nested objects, let's be careful
        // Actually, let's just write the whole thing as a JSON
        // Since we can't easily eval() safely here, we'll try JSON.parse
        // If it fails, we might need a more robust parser or just keep it as JS for now
        const parsedCitations = JSON.parse(objStr);
        Object.assign(citations, parsedCitations);
    } catch (e) {
        console.error("Failed to parse citations:", e.message);
    }
}

const finalData = {
    assessments,
    citations
};

fs.writeFileSync('assets/data/assessments.json', JSON.stringify(finalData, null, 2));
console.log("Successfully created assets/data/assessments.json");
