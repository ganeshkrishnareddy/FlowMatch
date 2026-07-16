# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | Yes                |

## Reporting a Vulnerability

If you discover a security vulnerability in FlowMatch, please report it
responsibly. You can:

1. **Open a GitHub issue** with the label `security` if the vulnerability does
   not expose sensitive information publicly.
2. **Contact the maintainer directly** through the ProgVision GitHub profile
   if the issue requires private disclosure.

When reporting, please include:

- A clear description of the vulnerability.
- Steps to reproduce the issue.
- The potential impact and any affected components.
- Suggested fix or mitigation, if available.

We will acknowledge receipt of your report within 48 hours and aim to provide
an initial assessment within 5 business days.

## Security Scanning

FlowMatch automatically scans all indexed workflows for exposed secrets and
suspicious patterns. This includes detection of:

- Hardcoded API keys, tokens, and credentials.
- Unencrypted sensitive data in workflow configurations.
- Suspicious node patterns that may indicate malicious intent.
- Known vulnerable integration configurations.

Workflows flagged by the scanner are reviewed before being made publicly
available and receive a reduced quality score to inform users of potential risks.

## Responsible Disclosure

We ask that you:

- Allow reasonable time for the issue to be addressed before public disclosure.
- Avoid accessing or modifying data belonging to other users.
- Act in good faith to avoid disruption to the service and its users.

We are committed to working with security researchers and will credit
contributors who report valid vulnerabilities, unless anonymity is requested.

---

Thank you for helping keep FlowMatch and its users safe.
