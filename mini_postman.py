import json
import requests
import sys
from pathlib import Path

# =========================================
# FILES
# =========================================

COOKIES_FILE = Path("mini_postman_cookies.json")
TOKEN_FILE = Path("mini_postman_token.json")

# =========================================
# COOKIES
# =========================================

def load_cookies():

    if not COOKIES_FILE.exists():
        return {}

    try:
        with open(COOKIES_FILE, "r") as f:
            return json.load(f)

    except Exception:
        return {}


def save_cookies(cookies):

    with open(COOKIES_FILE, "w") as f:
        json.dump(cookies, f, indent=4)


def clear_cookies():

    if COOKIES_FILE.exists():
        COOKIES_FILE.unlink()


def cookies_to_header(cookies):

    return "; ".join(f"{k}={v}" for k, v in cookies.items())


# =========================================
# ACCESS TOKEN
# =========================================

def load_token():

    if not TOKEN_FILE.exists():
        return None

    try:
        with open(TOKEN_FILE, "r") as f:
            data = json.load(f)

            return data.get("accessToken")

    except Exception:
        return None


def save_token(token):

    with open(TOKEN_FILE, "w") as f:
        json.dump(
            {
                "accessToken": token
            },
            f,
            indent=4
        )


def clear_token():

    if TOKEN_FILE.exists():
        TOKEN_FILE.unlink()


# =========================================
# DEBUG
# =========================================

def print_request(method, url, headers, body):

    print(f"\n➡️ Sending {method} {url}")

    if headers:
        print("\n📨 Headers:")
        print(json.dumps(headers, indent=4))

    if body:
        print("\n📦 Body:")
        print(json.dumps(body, indent=4))


def print_response(response, response_json):

    print(f"\n📌 Status: {response.status_code}")

    print("\n📥 Response:")

    if response_json:
        print(
            json.dumps(
                response_json,
                indent=4,
                ensure_ascii=False
            )
        )
    else:
        print(response.text)


# =========================================
# MAIN REQUEST
# =========================================

def send_request_from_file(request_file):

    print(f"📄 Loading request from: {request_file}")

    # =====================================
    # LOAD REQUEST FILE
    # =====================================

    try:
        with open(request_file, "r") as f:
            req = json.load(f)

    except Exception as e:
        print(f"\n❌ Failed to load request file: {e}")
        return

    method = req.get("method", "GET").upper()
    url = req.get("url")
    headers = req.get("headers", {})
    body = req.get("body")

    if not url:
        print("\n❌ URL missing")
        return

    # =====================================
    # LOAD COOKIES
    # =====================================

    cookies = load_cookies()

    if cookies:
        headers["Cookie"] = cookies_to_header(cookies)

    # =====================================
    # LOAD ACCESS TOKEN
    # =====================================

    access_token = load_token()

    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"

    # =====================================
    # DEBUG REQUEST
    # =====================================

    print_request(method, url, headers, body)

    # =====================================
    # SEND REQUEST
    # =====================================

    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=body if method in ["POST", "PUT", "PATCH"] else None,
            timeout=10
        )

    except requests.exceptions.Timeout:
        print("\n❌ Request timeout")
        return

    except Exception as e:
        print(f"\n❌ Network error: {e}")
        return

    # =====================================
    # PARSE RESPONSE
    # =====================================

    try:
        response_json = response.json()

    except Exception:
        response_json = None

    # =====================================
    # DEBUG RESPONSE
    # =====================================

    print_response(response, response_json)

    # =====================================
    # SAVE COOKIES
    # =====================================

    new_cookies = response.cookies.get_dict()

    if new_cookies:

        print("\n🍪 NEW COOKIES:")
        print(json.dumps(new_cookies, indent=4))

        # remove empty cookies
        for key, value in list(new_cookies.items()):

            if value == "":
                cookies.pop(key, None)

            else:
                cookies[key] = value

        if cookies:
            save_cookies(cookies)
            print("💾 Cookies saved")

        else:
            clear_cookies()
            print("🗑 Cookies cleared")

    # =====================================
    # SAVE ACCESS TOKEN
    # =====================================

    if response_json and "accessToken" in response_json:

        save_token(response_json["accessToken"])

        print("🔐 Access token saved")

    # =====================================
    # AUTO CLEAR TOKEN ON LOGOUT
    # =====================================

    if url.endswith("/logout") and response.status_code in [200, 204]:

        clear_token()
        clear_cookies()

        print("🚪 Logged out")
        print("🗑 Tokens and cookies removed")


# =========================================
# ENTRY POINT
# =========================================

if __name__ == "__main__":

    if len(sys.argv) != 2:

        print("\nUsage:")
        print("python3 mini_postman.py <request.json>\n")

        sys.exit(1)

    send_request_from_file(sys.argv[1])