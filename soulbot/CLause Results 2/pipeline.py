"""
SoulBot Pipeline — Stage 6: Monthly Pipeline Scheduler
--------------------------------------------------------
Orchestrates the full Human-in-the-Loop training cycle.

Stages:
  1. Data Collector  → runs continuously (embedded in inference.py)
  2. Human Review    → weekly (manual, CLI tool)
  3. Augmentation    → automated, monthly
  4. Training        → automated, monthly (after augmentation)
  5. Validation      → automated (blocks deployment on failure)
  6. Deployment      → staged rollout (5% → 100%)

Run monthly:
    python scheduler/pipeline.py --run-monthly
    python scheduler/pipeline.py --status
    python scheduler/pipeline.py --stage augment
    python scheduler/pipeline.py --stage train
    python scheduler/pipeline.py --stage validate
"""

import json
import subprocess
import sys
import argparse
from datetime import datetime, timezone
from pathlib import Path


LOGS_DIR     = Path("logs")
PIPELINE_LOG = LOGS_DIR / "pipeline_runs.jsonl"
REVIEW_QUEUE = LOGS_DIR / "review_queue.jsonl"
TRAIN_CANDS  = LOGS_DIR / "training_candidates.jsonl"
AUG_DATASET  = LOGS_DIR / "augmented_dataset.jsonl"
VALID_LOG    = LOGS_DIR / "validation_runs.jsonl"

STAGES = ["review_check", "augment", "train", "validate"]

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"


def log_pipeline_event(event: dict):
    LOGS_DIR.mkdir(exist_ok=True)
    with open(PIPELINE_LOG, "a") as f:
        f.write(json.dumps({**event, "ts": datetime.now(timezone.utc).isoformat()}) + "\n")


def count_lines(path: Path) -> int:
    if not path.exists():
        return 0
    return sum(1 for _ in open(path))


def count_pending_review() -> int:
    if not REVIEW_QUEUE.exists():
        return 0
    count = 0
    with open(REVIEW_QUEUE) as f:
        for line in f:
            try:
                if json.loads(line).get("review_status") == "pending":
                    count += 1
            except:
                pass
    return count


def get_last_validation() -> dict:
    if not VALID_LOG.exists():
        return {}
    lines = open(VALID_LOG).readlines()
    if not lines:
        return {}
    try:
        return json.loads(lines[-1])
    except:
        return {}


def print_status():
    print(f"\n{BOLD}{'═'*65}{RESET}")
    print(f"{BOLD}  SoulBot Pipeline Status{RESET}")
    print(f"{DIM}  {datetime.now().strftime('%Y-%m-%d %H:%M')}{RESET}")
    print(f"{'═'*65}")

    pending = count_pending_review()
    candidates = count_lines(TRAIN_CANDS)
    augmented  = count_lines(AUG_DATASET)
    last_valid = get_last_validation()

    def status_icon(condition): return f"{GREEN}✅{RESET}" if condition else f"{YELLOW}⚠️{RESET}"

    print(f"\n  {'Stage':<30} {'Status':<15} {'Detail'}")
    print(f"  {'─'*60}")

    # Review queue
    rev_ok = pending < 100
    print(f"  {'Review Queue':<30} {status_icon(rev_ok):<15} {pending} turns pending")

    # Training candidates
    cand_ok = candidates >= 100
    print(f"  {'Training Candidates':<30} {status_icon(cand_ok):<15} {candidates} approved examples")

    # Augmented dataset
    aug_ok = augmented >= 500
    print(f"  {'Augmented Dataset':<30} {status_icon(aug_ok):<15} {augmented} examples")

    # Last validation
    if last_valid:
        val_approved = last_valid.get("deployment_approved", False)
        val_date = last_valid.get("run_at", "?")[:10]
        sc = last_valid.get("safety_critical", {})
        print(f"  {'Last Validation':<30} {status_icon(val_approved):<15} {val_date} — SC: {sc.get('pass',0)}/{sc.get('pass',0)+sc.get('fail',0)}")
    else:
        print(f"  {'Last Validation':<30} {YELLOW}⚠️{RESET}             Never run")

    print()

    # Readiness assessment
    ready_for_augment = candidates >= 100
    ready_for_train   = augmented >= 500
    ready_for_deploy  = last_valid.get("deployment_approved", False)

    print(f"  {BOLD}Pipeline Readiness:{RESET}")
    print(f"    Augmentation:  {'Ready' if ready_for_augment else 'Need more approved candidates'}")
    print(f"    Training:      {'Ready' if ready_for_train else 'Run augmentation first'}")
    print(f"    Deployment:    {'Approved ✅' if ready_for_deploy else 'Must pass validation first'}")

    if pending >= 50:
        print(f"\n  {YELLOW}⚠️  {pending} turns pending review. Run weekly review session:{RESET}")
        print(f"     python reviewer/review_cli.py --limit 50")

    print(f"\n{'═'*65}\n")


def run_stage(stage: str, dry_run: bool = False) -> bool:
    """Run a single pipeline stage. Returns True on success."""
    print(f"\n{BOLD}{'─'*65}{RESET}")
    print(f"{BOLD}  Running stage: {stage.upper()}{RESET}")
    print(f"{'─'*65}")

    log_pipeline_event({"stage": stage, "status": "started", "dry_run": dry_run})

    if stage == "review_check":
        pending = count_pending_review()
        if pending > 0:
            print(f"\n  {YELLOW}⚠️  {pending} turns pending human review.{RESET}")
            print(f"  Human review must be completed before training.")
            print(f"  Run: python reviewer/review_cli.py --limit 50")
            if pending > 200:
                print(f"\n  {RED}❌ BLOCKING: Too many unreviewed turns ({pending}).{RESET}")
                print(f"     Training is blocked until the queue is below 200.")
                log_pipeline_event({"stage": stage, "status": "blocked", "pending": pending})
                return False
            print(f"\n  Proceeding (queue is manageable). Complete review asap.")
        else:
            print(f"  {GREEN}✅ Review queue is clear.{RESET}")
        log_pipeline_event({"stage": stage, "status": "passed", "pending": pending})
        return True

    elif stage == "augment":
        candidates = count_lines(TRAIN_CANDS)
        if candidates < 100:
            print(f"  {RED}❌ Only {candidates} training candidates. Need at least 100.{RESET}")
            log_pipeline_event({"stage": stage, "status": "skipped", "candidates": candidates})
            return False
        cmd = [sys.executable, "augmentor/augment.py", "--multiplier", "4"]
        if dry_run:
            cmd.append("--stats")
        result = subprocess.run(cmd, capture_output=False)
        success = result.returncode == 0
        log_pipeline_event({"stage": stage, "status": "completed" if success else "failed"})
        return success

    elif stage == "train":
        augmented = count_lines(AUG_DATASET)
        if augmented < 500:
            print(f"  {RED}❌ Only {augmented} augmented examples. Need at least 500.{RESET}")
            log_pipeline_event({"stage": stage, "status": "skipped", "augmented": augmented})
            return False
        cmd = [sys.executable, "trainer/train.py"]
        if dry_run:
            cmd.append("--dry-run")
        result = subprocess.run(cmd, capture_output=False)
        success = result.returncode == 0
        log_pipeline_event({"stage": stage, "status": "completed" if success else "failed"})
        return success

    elif stage == "validate":
        cmd = [sys.executable, "validator/validate.py"]
        result = subprocess.run(cmd, capture_output=False)
        success = result.returncode == 0
        log_pipeline_event({"stage": stage, "status": "approved" if success else "blocked"})
        return success

    else:
        print(f"  {RED}Unknown stage: {stage}{RESET}")
        return False


def run_monthly_pipeline(dry_run: bool = False):
    print(f"\n{BOLD}{'═'*65}{RESET}")
    print(f"{BOLD}  SoulBot — Monthly Training Pipeline{RESET}")
    print(f"{DIM}  {datetime.now().strftime('%Y-%m-%d %H:%M')}{RESET}")
    print(f"{'═'*65}")

    if dry_run:
        print(f"\n  {YELLOW}DRY RUN MODE — No model changes will be made{RESET}")

    log_pipeline_event({"event": "monthly_pipeline_started", "dry_run": dry_run})

    for stage in STAGES:
        success = run_stage(stage, dry_run=dry_run)
        if not success and stage in ("review_check", "train", "validate"):
            print(f"\n  {RED}❌ Pipeline stopped at stage: {stage}{RESET}")
            print(f"     Resolve the issue above and re-run.")
            log_pipeline_event({"event": "monthly_pipeline_stopped", "at_stage": stage})
            return False

    print(f"\n{'═'*65}")
    print(f"  {GREEN}{BOLD}✅ Monthly pipeline complete.{RESET}")

    last_valid = get_last_validation()
    if last_valid.get("deployment_approved"):
        print(f"  {GREEN}Deployment is approved. Proceed with staged rollout.{RESET}")
        print(f"\n  Staged rollout procedure:")
        print(f"    1. Route 5% of traffic to new adapter")
        print(f"    2. Monitor crisis escalation rate for 48h")
        print(f"    3. If no regression → 25% → 50% → 100%")
        print(f"    4. Keep previous adapter as instant rollback")
    else:
        print(f"  {RED}Deployment is NOT approved. Validation failed.{RESET}")
        print(f"  Do not route any traffic to the new adapter.")

    print(f"{'═'*65}\n")
    log_pipeline_event({"event": "monthly_pipeline_completed"})
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SoulBot Monthly Pipeline Scheduler")
    parser.add_argument("--run-monthly", action="store_true", help="Run full monthly pipeline")
    parser.add_argument("--status", action="store_true", help="Show pipeline status")
    parser.add_argument("--stage", choices=STAGES, help="Run a single stage")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, no model changes")
    args = parser.parse_args()

    if args.status:
        print_status()
    elif args.stage:
        success = run_stage(args.stage, dry_run=args.dry_run)
        sys.exit(0 if success else 1)
    elif args.run_monthly:
        success = run_monthly_pipeline(dry_run=args.dry_run)
        sys.exit(0 if success else 1)
    else:
        print_status()
