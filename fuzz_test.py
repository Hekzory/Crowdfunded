import requests
import random
import json

BASE_URL = "http://localhost:3000"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiYWRtaW4yQGFkbWluLmNvbSIsInByb3ZpZGVyIjoiZW1haWwiLCJpYXQiOjE3NDk3NDQyNTMsImV4cCI6MTc0OTc1MTQ1M30.4_ygaSpaeFqTq1mcGRepN9eNrdyTpsDUNSPz6uns-tI"
CSRF_TOKEN = "LC0vvE0hUPzcn8CdtNzxnbo3ABT1qdF7"

def fuzz_string():
    payloads = [
        "",
        "A" * 10_000,
        "'; DROP TABLE projects; --",
        "<script>alert(1)</script>",
        "😀💣🦄",
        "тест",
        b"\xff\xfe\xfa".decode("utf-8", errors="replace"),
        "foo@bar.com",
        "\x00\x19\x7f",
        "\\'\"`~!@#$%^&*()[]{}",
    ]
    return random.choice(payloads)

def fuzz_number():
    payloads = [
        0,
        -random.randint(1, 1_000_000),
        random.randint(1_000_000, 1_000_000_000),
        "not_a_number",
        None
    ]
    return random.choice(payloads)

def fuzz_id():
    payloads = [
        random.randint(1, 100),
        -random.randint(1, 100),
        "",
        "abc",
        "9999999999999999999",
        "1; DROP TABLE users;",
    ]
    return random.choice(payloads)

def fuzz_json(base: dict, required_fields: list):
    d = base.copy()
    if required_fields and random.random() < 0.5:
        to_remove = random.choice(required_fields)
        d.pop(to_remove, None)
    if random.random() < 0.5:
        d["unexpected_field_" + fuzz_string()[:3]] = fuzz_string()
    for k in d:
        if random.random() < 0.3:
            d[k] = [fuzz_string(), fuzz_number()]
    return d

def pretty_print_response(method, url, response):
    status = response.status_code
    try:
        content_type = response.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            data = response.json()
            msg = json.dumps(data, ensure_ascii=False, indent=2)
        elif 'text/html' in content_type:
            text = response.text
            if "<title>" in text:
                title = text.split("<title>")[1].split("</title>")[0]
            else:
                title = "HTML error page"
            msg = f"[HTML] {title}"
        else:
            msg = response.text.strip()
    except Exception:
        msg = "<не удалось распарсить ответ>"

    status_str = f"{status}"
    if status >= 500:
        status_str = f"\033[91m{status}\033[0m"
    elif status >= 400:
        status_str = f"\033[93m{status}\033[0m"
    elif status >= 200:
        status_str = f"\033[92m{status}\033[0m"

    print(f"{method} {url} → {status_str}")
    if status >= 400:
        print(f"  ↳ {msg}")

def random_auth_cookies():
    choices = [
        {"auth_token": AUTH_TOKEN, "csrftoken": CSRF_TOKEN},
        {"auth_token": f"{AUTH_TOKEN}corrupted", "csrftoken": CSRF_TOKEN},
        {"auth_token": AUTH_TOKEN, "csrftoken": f"{CSRF_TOKEN}corrupted"},
        {"auth_token": AUTH_TOKEN},
        {"csrftoken": CSRF_TOKEN},
        {"auth_token": "", "csrftoken": ""},
        {},
        None,
    ]
    return random.choice(choices)

def send(method, url, cookies=None, json_data=None):
    try:
        response = requests.request(method, url, cookies=cookies, json=json_data, timeout=5)
        pretty_print_response(method, url, response)
        return response
    except Exception as e:
        print(f"{method} {url} → \033[91mEXCEPTION\033[0m")
        print(f"  ↳ {e}")

def test_post_projects():
    url = f"{BASE_URL}/api/projects"
    base_json = {
        "title": fuzz_string(),
        "description": fuzz_string(),
        "goal": fuzz_number(),
    }
    data = fuzz_json(base_json, ["title", "goal"])
    cookies = random_auth_cookies()
    send("POST", url, cookies=cookies, json_data=data)

def test_get_projects():
    url = f"{BASE_URL}/api/projects"
    send("GET", url)

def test_get_project_by_id():
    id_ = fuzz_id()
    url = f"{BASE_URL}/api/projects/{id_}"
    send("GET", url)

def test_post_contribution():
    id_ = fuzz_id()
    url = f"{BASE_URL}/api/projects/{id_}/contributions"
    base_json = {"amount": fuzz_number()}
    data = fuzz_json(base_json, ["amount"])
    cookies = random_auth_cookies()
    send("POST", url, cookies=cookies, json_data=data)

def test_get_user_contributions():
    url = f"{BASE_URL}/api/user/contributions"
    cookies = random_auth_cookies()
    send("GET", url, cookies=cookies)

def test_get_admin_contributions():
    url = f"{BASE_URL}/api/admin/contributions"
    cookies = random_auth_cookies()
    send("GET", url, cookies=cookies)

def test_get_admin_projects():
    url = f"{BASE_URL}/api/admin/projects"
    cookies = random_auth_cookies()
    send("GET", url, cookies=cookies)

def main():
    for _ in range(500):
        test_post_projects()
        test_get_projects()
        test_get_project_by_id()
        test_post_contribution()
        test_get_user_contributions()
        test_get_admin_contributions()
        test_get_admin_projects()

if __name__ == "__main__":
    main()