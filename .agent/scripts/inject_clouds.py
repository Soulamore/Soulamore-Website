import json
import os
import glob

insights = {
    'emotional_regulation.json': {
        "0": {
            'type': 'clinical',
            'title': 'The Pause Response',
            'text': 'When we pause before reacting, we create a tiny buffer zone. According to clinical protocols like Dialectical Behavior Therapy (DBT), this micro-pause is a profound resilience skill, allowing your nervous system to catch its breath before engaging.',
            'source_name': 'Therapeutic Modalities (DBT)'
        },
        "2": {
            'type': 'stat',
            'title': 'The Body Speaks First',
            'text': 'It is incredibly common for your body to signal distress before your mind fully registers it. Research on somatic markers shows that tight chests or sudden heat are just your body\'s way of intensely trying to protect you.',
            'source_name': 'Cultural Formulation & Somatic Psychology'
        }
    },
    'anxiety_overthinking.json': {
        "0": {
            'type': 'fact',
            'title': 'Anticipatory Protection',
            'text': 'Overthinking isn\'t a character flaw; it\'s often an evolutionary defense mechanism. Clinical frameworks like the GAD-7 recognize that anticipating the future is simply your mind\'s exhausting attempt to keep you safe from uncertainty.',
            'source_name': 'Level 1 Cross-Cutting Symptom Measures'
        },
        "3": {
            'type': 'clinical',
            'title': 'Catastrophizing',
            'text': 'When uncertainty hits, many of us jump to the worst-case scenario. This is a recognized cognitive distortion known as \'catastrophizing\'. You are not alone in this—it\'s a very human reflex when we feel fundamentally unsafe.',
            'source_name': 'Cognitive Behavioral Therapy (CBT) Frameworks'
        }
    },
    'burnout_career.json': {
        "0": {
            'type': 'fact',
            'title': 'More Than Just Tired',
            'text': 'Burnout differs from standard fatigue. Occupational frameworks emphasize that burnout involves \'depersonalization\'—a protective numbness that sets in when you endure prolonged, systemic stress without adequate relief.',
            'source_name': 'Occupational Psychology Measures'
        },
        "3": {
            'type': 'guideline',
            'title': 'Your Right to Rest',
            'text': 'Under the Mental Healthcare Act (2017), your psychological well-being is a protected right. Experiencing profound exhaustion means your system requires structural rest, and prioritizing that recovery is a critical health necessity, not a luxury.',
            'source_name': 'Mental Healthcare Act 2017 (India)'
        }
    },
    'relationship_patterns.json': {
        "0": {
            'type': 'clinical',
            'title': 'Attachment Security',
            'text': 'How we handle baseline relationship friction often traces back to our earliest attachment patterns. Seeking proximity or clarity during conflict is a strong indicator of a secure relational foundation.',
            'source_name': 'Early Development & Attachment Theory'
        },
        "3": {
            'type': 'compassion',
            'title': 'The Urge to Pull Away',
            'text': 'Sometimes, creating extreme distance during conflict feels like the only way to survive it. This is a common protective adaptation, often learned in environments where emotions were invalidated or unsafe to express.',
            'source_name': 'Brief Solution-Focused Therapy Principles'
        }
    }
}

print("starting injection...")
for fname, updates in insights.items():
    path = f'assets/data/assessments/{fname}'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for q_idx_str, cloud_data in updates.items():
            q_idx = int(q_idx_str)
            if q_idx < len(data['questions']):
                if 'clinical_context' in data['questions'][q_idx]:
                    del data['questions'][q_idx]['clinical_context']
                data['questions'][q_idx]['insight_cloud'] = cloud_data
                
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f'Injecting insight clouds into {fname}...')
    except Exception as e:
        print(f'Error updating {fname}: {e}')

print('Re-compiling assessment-data.js...')
js_content = 'window.SoulamoreAssessments = {};\nwindow.SoulamoreCitations = {};\n'

for f in glob.glob('assets/data/assessments/*.json'):
    if 'clinical_citations' in f:
        data = json.load(open(f, encoding='utf-8'))
        js_content += f'\nwindow.SoulamoreCitations = {json.dumps(data)};\n'
    else:
        name = os.path.basename(f).replace('.json', '')
        data = json.load(open(f, encoding='utf-8'))
        js_content += f'\nwindow.SoulamoreAssessments["{name}"] = {json.dumps(data)};\n'

with open('assets/js/assessment-data.js', 'w', encoding='utf-8') as out:
    out.write(js_content)
print('Complete!')
