import json
import os

PATTERNS_PATH = os.path.join(os.path.dirname(__file__), "data", "patterns.json")

class ScoringEngine:
    def __init__(self):
        self.patterns = self._load_patterns()

    def _load_patterns(self):
        if os.path.exists(PATTERNS_PATH):
            with open(PATTERNS_PATH, "r") as f:
                return json.load(f)
        return {}

    def classify(self, scores):
        """
        Deterministic classification logic.
        scores = { 'regulation': 0-100, 'sensitivity': 0-100, 'impulsivity': 0-100 }
        """
        reg = scores.get('regulation', 50)
        sen = scores.get('sensitivity', 50)
        imp = scores.get('impulsivity', 50)

        # Simple logic for Tier 1
        if sen > 70 and reg < 40:
            return self.patterns.get("high_sensitivity_avoidant")
        if reg > 70 and sen < 40:
            return self.patterns.get("analytical_controlled")
        
        # Default fallback
        return self.patterns.get("emotional_intensity_moderate")

    def generate_report(self, scores):
        pattern = self.classify(scores)
        
        # Simple Template Fill (Step 3)
        report = {
            "title": pattern["name"],
            "summary": pattern["template"],
            "suggestion": f"Recommended approach: {pattern['modality']}",
            "impact_analysis": pattern["impact"],
            "is_ai_generated": False
        }
        return report

if __name__ == "__main__":
    engine = ScoringEngine()
    test_scores = {'regulation': 30, 'sensitivity': 85, 'impulsivity': 50}
    report = engine.generate_report(test_scores)
    print(json.dumps(report, indent=2))
