import re, html, urllib.request, urllib.parse, unicodedata, datetime, os, time

BASE = 'https://www.pacotespelomundo.com.br'
OUT = 'D:/Donwloads/APPS/rodrigo-ruas/_docs/pacotes-assinados-ruas'
START = '/pacotes-assinados-por-rodrigo-ruas-1/'
NAV = {'/', '/américa-central-2/', '/américa-do-norte/', '/américa-do-sul/', '/europa-2/',
       '/grupos-assinados/', '/grupos-regulares/', '/quem-somos/', '/ásia/', START}
TODAY = datetime.date.today().isoformat()

def fetch(path):
    url = BASE + urllib.parse.quote(path)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return url, urllib.request.urlopen(req, timeout=30).read().decode('utf-8')

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def absu(u):
    return u if u.startswith('http') else BASE + urllib.parse.quote(u)

def main_fragment(page):
    s = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', '', page)
    s = s[s.find('</ws-header>'):]
    s = s[:s.find('<footer')]
    # remove floating whatsapp embed
    s = re.sub(r'(?is)<ws-html-embed.*?</ws-html-embed>', '', s)
    return s

def links_in(fragment):
    return [l for l in dict.fromkeys(re.findall(r'href="([^"]+)"', fragment))
            if l.startswith('/') and not l.startswith('/ws/') and l not in NAV]

def to_md(frag):
    s = re.sub(r'\s+', ' ', frag)
    # hero/section background images
    s = re.sub(r'<ws-block[^>]*background-image="[^"]*?(/ws/media-library/[^",\s]+)[^"]*"[^>]*>',
               lambda m: '\n\n![](%s)\n\n' % absu(m.group(1)), s)
    # media containers & pictures -> image
    def img(m):
        chunk = m.group(0)
        src = re.search(r'origin-src="([^"]+)"', chunk) or re.search(r'<img[^>]*src="([^"]+)"', chunk)
        alt = re.search(r'<img[^>]*alt="([^"]*)"', chunk)
        return ' ![%s](%s) ' % (alt.group(1) if alt else '', absu(src.group(1))) if src else ''
    s = re.sub(r'(?is)<ws-media-container.*?</ws-media-container>', img, s)
    s = re.sub(r'(?is)<picture>.*?</picture>', img, s)
    # links
    def link(m):
        href, inner = m.group(1), m.group(2)
        return '[%s](%s)' % (inner.strip(), absu(href)) if inner.strip() else ''
    s = re.sub(r'(?is)<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', link, s)
    s = re.sub(r'</?ws-color[^>]*>', '', s)
    s = re.sub(r'</b>\s*<b>|</strong>\s*<strong>', '', s)
    for n in range(1, 7):
        s = re.sub(r'(?is)<h%d[^>]*>(.*?)</h%d>' % (n, n),
                   lambda m, n=n: '\n\n' + '#' * n + ' ' + re.sub(r'</?(b|strong)>', '', m.group(1)).strip() + '\n\n', s)
    s = re.sub(r'(?i)<(b|strong)>(\s*)(.*?)(\s*)</\1>', lambda m: m.group(2) + ('**%s**' % m.group(3) if m.group(3).strip() else '') + m.group(4), s)
    s = re.sub(r'(?i)<(i|em)>(\s*)(.*?)(\s*)</\1>', lambda m: m.group(2) + ('_%s_' % m.group(3) if m.group(3).strip() else '') + m.group(4), s)
    s = re.sub(r'(?i)<br\s*/?>', '\n', s)
    s = re.sub(r'(?i)<li[^>]*>', '\n- ', s)
    s = re.sub(r'(?i)</?(p|div|section|article|ws-text|ws-column|ul|ol|tr|table)[^>]*>', '\n\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('\xa0', ' ')
    lines = [l.strip() for l in s.split('\n')]
    s = '\n'.join(lines)
    s = re.sub(r'\n{3,}', '\n\n', s)
    s = re.sub(r'(?m)^(# .+)\n\n# (.+)$', r'\1 \2', s)  # junta h1 quebrado
    return s.strip() + '\n'

def title_of(page):
    t = re.search(r'<title>(.*?)</title>', page).group(1)
    return html.unescape(t).replace(' | RR VIAGENS', '').strip()

def write(fname, meta, body):
    fm = '---\n' + ''.join('%s: "%s"\n' % (k, str(v).replace('"', "'")) for k, v in meta.items()) + '---\n\n'
    with open(os.path.join(OUT, fname), 'w', encoding='utf-8', newline='\n') as f:
        f.write(fm + body)
    print('ok', fname)

# 1) listing
url, page = fetch(START)
frag = main_fragment(page)
regions = links_in(frag)
index_rows = []
region_packages = {}
seen_pkgs = {}

for rpath in regions:
    rurl, rpage = fetch(rpath)
    rfrag = main_fragment(rpage)
    rtitle = title_of(rpage)
    rname = rtitle.split(' - ')[0].strip()
    pkgs = links_in(rfrag)
    region_packages[rname] = []
    for p in pkgs:
        seen_pkgs.setdefault(p, []).append(rname)
    rfile = '01-regiao-%s.md' % slugify(rname)
    region_packages[rname] = pkgs
    write(rfile, {'tipo': 'regiao', 'titulo': rtitle, 'url': rurl, 'scraped_em': TODAY}, '# ' + rtitle + '\n\n' + to_md(rfrag))
    index_rows.append((rname, rfile, rurl))
    time.sleep(0.5)

pkg_files = {}
for p, regs in seen_pkgs.items():
    purl, ppage = fetch(p)
    pfrag = main_fragment(ppage)
    body = to_md(pfrag)
    ptitle = title_of(ppage)
    h1 = re.search(r'(?m)^# (.+)$', body)
    nome = ptitle.split(' - ')[0].strip()
    sub = re.search(r'(?m)^# .+\n\n##### (.+)$', body)
    fname = 'pacote-%s.md' % slugify(nome)
    meta = {'tipo': 'pacote', 'titulo': nome, 'titulo_pagina': ptitle, 'h1_no_site': h1.group(1).strip() if h1 else '',
            'subtitulo': sub.group(1).strip() if sub else '', 'regiao': ', '.join(regs),
            'url': purl, 'scraped_em': TODAY}
    write(fname, meta, body)
    pkg_files[p] = (nome, fname, purl)
    time.sleep(0.5)

# index
idx = '# ' + title_of(page) + '\n\n' + to_md(frag) + '\n---\n\n## Índice do scrap\n\n'
for rname, rfile, rurl in index_rows:
    idx += '### [%s](%s)\n\n' % (rname, rfile)
    for p in region_packages[rname]:
        nome, fname, purl = pkg_files[p]
        idx += '- [%s](%s) — %s\n' % (nome, fname, purl)
    idx += '\n'
write('00-index.md', {'tipo': 'listagem', 'titulo': title_of(page), 'url': url, 'scraped_em': TODAY}, idx)
