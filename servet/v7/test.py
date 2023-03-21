from urllib.parse import urlparse, urljoin
# from flask import request, url_for

host_url = 'http://www.servet.com'
target = None

def is_safe_url(target):
    ref_url = urlparse(host_url)
    test_url = urlparse(urljoin(host_url, target))
    print(test_url)
    return test_url.scheme in ('http', 'https') and \
            ref_url.netloc == test_url.netloc
