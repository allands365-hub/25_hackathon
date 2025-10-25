#!/usr/bin/env python3
"""
Security scanning script for BuildAI Arena
Scans for secrets, exposed API keys, and security vulnerabilities
"""

import os
import re
import subprocess
import sys
from pathlib import Path

def scan_for_secrets():
    """Scan for common secret patterns in the codebase"""
    print("Scanning for secrets and exposed API keys...")
    
    # Common secret patterns
    secret_patterns = [
        r'api[_-]?key\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'secret\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'password\s*[:=]\s*["\']?[a-zA-Z0-9_-]{8,}["\']?',
        r'token\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'private[_-]?key\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'auth[_-]?token\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'access[_-]?token\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
        r'bearer[_-]?token\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}["\']?',
    ]
    
    # API key patterns
    api_key_patterns = [
        r'sk-[a-zA-Z0-9]{48}',  # OpenAI API key
        r'pk_[a-zA-Z0-9]{24}',  # Stripe public key
        r'rk_[a-zA-Z0-9]{24}',  # Stripe restricted key
        r'ak_[a-zA-Z0-9]{24}',  # Generic API key
        r'AIza[0-9A-Za-z\\-_]{35}',  # Google API key
        r'ya29\.[0-9A-Za-z\\-_]+',  # Google OAuth token
        r'1//[0-9A-Za-z\\-_]+',  # Google OAuth token
        r'sbp_[a-zA-Z0-9]{40}',  # Supabase access token
        r'ghp_[a-zA-Z0-9]{36}',  # GitHub personal access token
        r'gho_[a-zA-Z0-9]{36}',  # GitHub OAuth token
        r'ghu_[a-zA-Z0-9]{36}',  # GitHub user token
        r'ghs_[a-zA-Z0-9]{36}',  # GitHub server token
        r'ghr_[a-zA-Z0-9]{36}',  # GitHub refresh token
    ]
    
    issues_found = []
    
    # Scan all relevant files
    for root, dirs, files in os.walk('.'):
        # Skip node_modules, .git, and other irrelevant directories
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.next', 'out', 'build', '__pycache__']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.py', '.env')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = content.split('\n')
                        
                        for line_num, line in enumerate(lines, 1):
                            # Check for secret patterns
                            for pattern in secret_patterns + api_key_patterns:
                                if re.search(pattern, line, re.IGNORECASE):
                                    # Skip if it's a template, example, or documentation file
                                    if any(x in file_path.lower() for x in ['template', 'example', 'sample', 'test', 'docs/', 'guide', 'audit']):
                                        continue
                                    # Skip if it's a placeholder value
                                    if any(x in line.lower() for x in ['your-', 'placeholder', 'example', 'template', 'your_']):
                                        continue
                                    
                                    issues_found.append({
                                        'file': file_path,
                                        'line': line_num,
                                        'content': line.strip(),
                                        'pattern': pattern
                                    })
                except Exception as e:
                    print(f"Warning: Could not read {file_path}: {e}")
    
    return issues_found

def run_detect_secrets():
    """Run detect-secrets tool"""
    print("Running detect-secrets scan...")
    try:
        result = subprocess.run(['detect-secrets', 'scan', '--all-files', '.'], 
                              capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            print(f"detect-secrets found issues: {result.stdout}")
            return True
        else:
            print("detect-secrets: No secrets found")
            return False
    except subprocess.TimeoutExpired:
        print("detect-secrets: Scan timed out")
        return False
    except FileNotFoundError:
        print("detect-secrets: Not installed, skipping")
        return False

def main():
    """Main security scanning function"""
    print("BuildAI Arena Security Scan")
    print("=" * 50)
    
    issues_found = scan_for_secrets()
    
    if issues_found:
        print(f"\nFound {len(issues_found)} potential security issues:")
        for issue in issues_found:
            print(f"  File: {issue['file']}:{issue['line']}")
            print(f"     Pattern: {issue['pattern']}")
            print(f"     Content: {issue['content'][:100]}...")
            print()
    else:
        print("No hardcoded secrets found in code files")
    
    # Run detect-secrets
    detect_secrets_issues = run_detect_secrets()
    
    print("\n" + "=" * 50)
    if issues_found or detect_secrets_issues:
        print("Security scan completed with issues found")
        print("Please review and fix the issues above before committing")
        sys.exit(1)
    else:
        print("Security scan completed - No issues found")
        sys.exit(0)

if __name__ == "__main__":
    main()
