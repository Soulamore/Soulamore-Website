import unittest
import os
import json
from blog_pipeline import MultiAgentBlogEngine, FORBIDDEN_CURE_WORDS, YMYL_DISCLAIMER_HTML, CRISIS_HELPLINE_HTML

class TestBlogPipeline(unittest.TestCase):
    def setUp(self):
        self.engine = MultiAgentBlogEngine()

    def test_clinical_safety_agent_catches_cure_words(self):
        unsafe_draft = {
            "title": "How to Cure Depression",
            "main_content": "<p>This step will solve your anxiety and fix mental health completely.</p>"
        }
        res = self.engine.critique_clinical_safety(unsafe_draft)
        self.assertFalse(res["passed"], "Clinical Safety Agent should flag 'cure', 'solve', and 'fix'.")
        self.assertTrue(len(res["flags"]) > 0)

    def test_clinical_safety_agent_approves_safe_draft(self):
        safe_draft = {
            "title": "Understanding Evening Anxiety",
            "main_content": "<p>When feeling overwhelmed, taking gentle breaths can support your nervous system.</p>"
        }
        res = self.engine.critique_clinical_safety(safe_draft)
        self.assertTrue(res["passed"], "Clinical Safety Agent should approve psychoeducational content.")

    def test_synthesizer_appends_ymyl_blocks(self):
        draft = {
            "title": "Navigating Rest",
            "metaDescription": "A comforting guide to rest.",
            "main_content": "<p>Rest is valuable.</p>",
            "readTimeMinutes": 2
        }
        safety = self.engine.critique_clinical_safety(draft)
        tone = self.engine.critique_tone_warmth(draft)
        skeptic = self.engine.critique_fact_skeptic(draft)
        seo = self.engine.critique_seo_structure(draft)

        post = self.engine.synthesize_post(draft, safety, tone, skeptic, seo, "everyday-coping")
        
        self.assertIn(YMYL_DISCLAIMER_HTML, post["content"])
        self.assertIn(CRISIS_HELPLINE_HTML, post["content"])
        self.assertEqual(post["status"], "pending_review", "Status MUST be pending_review for human gate.")
        self.assertIn("panel_notes", post)

if __name__ == "__main__":
    unittest.main()
