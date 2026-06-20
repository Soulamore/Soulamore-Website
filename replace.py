import re

new_func = '''function getRootPath() {
    const script = document.querySelector('script[src*="components.js"]');
    if (script) {
        const rawSrc = script.getAttribute('src');
        if (rawSrc && !rawSrc.startsWith('http') && !rawSrc.startsWith('/')) {
            const depth = (rawSrc.match(/\.\.\//g) || []).length;
            return depth > 0 ? '../'.repeat(depth) : '';
        }
    }

    const path = window.location.pathname.toLowerCase();

    if (path.includes('/spaces/campus/') ||
        path.includes('/spaces/soulamore-away/') ||
        path.includes('/spaces/soulamore-workplace/') ||
        path.includes('/spaces/assessments/') ||
        path.includes('/tools/confession-box/') ||
        path.includes('/portal/admin-dashboard/') ||
        (path.includes('/our-peers/') && path.split('/our-peers/')[1] && path.split('/our-peers/')[1].includes('/'))) {
        return "../../";
    }

    if (path.includes('/spaces/') ||
        path.includes('/tools/') ||
        path.includes('/company/') ||
        path.includes('/portal/') ||
        path.includes('/our-peers/') ||
        path.includes('/our-psychologists/') ||
        path.includes('/join-us/') ||
        path.includes('/pages/')) {
        return "../";
    }

    return '';
}'''

for filepath in ['assets/js/components.js', 'assets/js/auth-handler.js']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to match function getRootPath() { ... }
    # assuming it's the only function with this name
    pattern = re.compile(r'function getRootPath\(\)\s*\{.*?\n\}', re.DOTALL)
    new_content = pattern.sub(new_func, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
