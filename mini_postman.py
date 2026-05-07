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
    if COOKIES_FILE.exists():
        try:
            with open(COOKIES_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}

    return {}


def save_cookies(cookie_dict):
    with open(COOKIES_FILE, "w") as f:
        json.dump(cookie_dict, f, indent=4)


def cookies_to_header(cookie_dict):
    return "; ".join(f"{k}={v}" for k, v in cookie_dict.items())


# =========================================
# ACCESS TOKEN
# =========================================

def load_token():
    if TOKEN_FILE.exists():
        try:
            with open(TOKEN_FILE, "r") as f:
                data = json.load(f)

                return data.get("accessToken")

        except Exception:
            return None

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


# =========================================
# REQUEST LOGIC
# =========================================

def send_request_from_file(request_file):

    print(f"📄 Loading request from: {request_file}")

    # -------------------------------------
    # READ JSON REQUEST FILE
    # -------------------------------------

    try:
        with open(request_file, "r") as f:
            req = json.load(f)

    except Exception as e:
        print(f"❌ Error reading JSON: {e}")
        return

    method = req.get("method", "GET").upper()
    url = req.get("url")
    headers = req.get("headers", {})
    body = req.get("body")

    if not url:
        print("❌ URL missing in request file")
        return

    # -------------------------------------
    # LOAD COOKIES
    # -------------------------------------

    cookies = load_cookies()

    if cookies:
        headers["Cookie"] = cookies_to_header(cookies)

    # -------------------------------------
    # LOAD ACCESS TOKEN
    # -------------------------------------

    access_token = load_token()

    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"

    # -------------------------------------
    # DEBUG
    # -------------------------------------

    print(f"➡️ Sending {method} {url}")

    if headers:
        print("\n📨 Headers:")
        print(json.dumps(headers, indent=4))

    if body:
        print("\n📦 Body:")
        print(json.dumps(body, indent=4))

    # -------------------------------------
    # SEND REQUEST
    # -------------------------------------

    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=body if method in ["POST", "PUT", "PATCH"] else None
        )

    except Exception as e:
        print(f"\n❌ Network error: {e}")
        return

    # -------------------------------------
    # RESPONSE
    # -------------------------------------

    print(f"\n📌 Status: {response.status_code}")

    print("\n📥 Response:")

    try:
        response_json = response.json()

        print(
            json.dumps(
                response_json,
                indent=4,
                ensure_ascii=False
            )
        )

    except Exception:
        print(response.text)

        response_json = None

    # -------------------------------------
    # SAVE COOKIES
    # -------------------------------------

    new_cookies = response.cookies.get_dict()

    if new_cookies:

        print("\n🍪 NEW COOKIES:")
        print(json.dumps(new_cookies, indent=4))

        cookies.update(new_cookies)

        save_cookies(cookies)

        print("💾 Cookies saved → mini_postman_cookies.json")

    # -------------------------------------
    # SAVE ACCESS TOKEN
    # -------------------------------------

    if response_json and "accessToken" in response_json:

        save_token(response_json["accessToken"])

        print("🔐 Access token saved → mini_postman_token.json")


# =========================================
# ENTRY POINT
# =========================================

if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("\nUsage:")
        print("python3 mini_postman.py <request.json>\n")
        sys.exit(1)

    send_request_from_file(sys.argv[1])