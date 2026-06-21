# Testing Protocol & System

Welcome to the dedicated **Testing Workspace**. This directory is meant to hold active testing registries for **Aditya** and **Abhishek**.

## Nomenclature
To differentiate testing registries from standard reports, all active test suites in this folder must follow this nomenclature:

`TEST_[Feature-Name]_[Date].md`

*(Example: `TEST_User_Dashboard_Consent_2026-06-21.md`)*

## The Testing System
We use **Living Documents** for our test suites. This means:
1. Each test suite contains a table of "Use Cases".
2. Every Use Case has two specific sets of tracking fields:
   - **Aditya (AD) Status** & **Date**
   - **Abhishek (AB) Status** & **Date**
3. Both Aditya and Abhishek must independently run the test and update their respective fields (e.g., `✅ PASS` or `❌ FAIL`).
4. Add any notes, bug links, or comments in the "Updates & Testing Log" section at the bottom of the test suite.

## Git Protocol
- Active test suites **MUST** be committed to Git so both of you can collaborate on them.
- Only archived or deprecated test files should be added to `.gitignore`.

This folder serves as your single source of truth for all manual QA and verification across the platform.
