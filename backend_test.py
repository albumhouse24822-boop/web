"""
Backend API Testing for Album House Prop Store
Tests all public endpoints, admin auth, CRUD operations, and AI quiz
"""
import requests
import json
from typing import Dict, Any, Optional

# Base URL from review request
BASE_URL = "https://props-store.preview.emergentagent.com/api"

# Admin credentials from backend/.env
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "albumhouse2026"

# Color codes for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

class TestResult:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.failures = []
    
    def add_pass(self, test_name: str):
        self.passed += 1
        print(f"{GREEN}✓{RESET} {test_name}")
    
    def add_fail(self, test_name: str, reason: str, response: Optional[Any] = None):
        self.failed += 1
        self.failures.append({
            "test": test_name,
            "reason": reason,
            "response": response
        })
        print(f"{RED}✗{RESET} {test_name}")
        print(f"  {RED}Reason:{RESET} {reason}")
        if response:
            print(f"  {RED}Response:{RESET} {response}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{BLUE}{'='*60}{RESET}")
        print(f"{BLUE}TEST SUMMARY{RESET}")
        print(f"{BLUE}{'='*60}{RESET}")
        print(f"Total Tests: {total}")
        print(f"{GREEN}Passed: {self.passed}{RESET}")
        print(f"{RED}Failed: {self.failed}{RESET}")
        
        if self.failures:
            print(f"\n{RED}FAILED TESTS:{RESET}")
            for i, failure in enumerate(self.failures, 1):
                print(f"\n{i}. {failure['test']}")
                print(f"   Reason: {failure['reason']}")
                if failure['response']:
                    print(f"   Response: {failure['response']}")
        
        return self.failed == 0

result = TestResult()

def test_endpoint(name: str, method: str, url: str, expected_status: int = 200, 
                  headers: Optional[Dict] = None, json_data: Optional[Dict] = None,
                  expected_keys: Optional[list] = None, expected_count: Optional[int] = None,
                  expected_value: Optional[Dict] = None) -> Optional[Any]:
    """Generic test function for API endpoints"""
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=json_data, timeout=10)
        elif method == "PUT":
            resp = requests.put(url, headers=headers, json=json_data, timeout=10)
        elif method == "DELETE":
            resp = requests.delete(url, headers=headers, timeout=10)
        else:
            result.add_fail(name, f"Unsupported method: {method}")
            return None
        
        # Check status code
        if resp.status_code != expected_status:
            result.add_fail(name, 
                          f"Expected status {expected_status}, got {resp.status_code}",
                          resp.text[:500])
            return None
        
        # Try to parse JSON
        try:
            data = resp.json()
        except:
            if expected_status == 200:
                result.add_fail(name, "Response is not valid JSON", resp.text[:500])
                return None
            data = None
        
        # Check expected keys
        if expected_keys and data:
            if isinstance(data, dict):
                for key in expected_keys:
                    if key not in data:
                        result.add_fail(name, f"Missing expected key: {key}", str(data)[:500])
                        return None
        
        # Check expected count (for lists)
        if expected_count is not None and isinstance(data, list):
            if len(data) != expected_count:
                result.add_fail(name, 
                              f"Expected {expected_count} items, got {len(data)}",
                              f"Received {len(data)} items")
                return None
        
        # Check expected value
        if expected_value and data:
            for key, value in expected_value.items():
                if isinstance(data, dict) and data.get(key) != value:
                    result.add_fail(name, 
                                  f"Expected {key}={value}, got {data.get(key)}",
                                  str(data)[:500])
                    return None
        
        result.add_pass(name)
        return data
    
    except requests.exceptions.Timeout:
        result.add_fail(name, "Request timeout (10s)")
        return None
    except requests.exceptions.ConnectionError:
        result.add_fail(name, "Connection error - server may be down")
        return None
    except Exception as e:
        result.add_fail(name, f"Exception: {str(e)}")
        return None

print(f"\n{BLUE}{'='*60}{RESET}")
print(f"{BLUE}ALBUM HOUSE PROP STORE - BACKEND API TESTS{RESET}")
print(f"{BLUE}{'='*60}{RESET}\n")

# ===================== 1. PUBLIC ENDPOINTS =====================
print(f"\n{YELLOW}[1] PUBLIC ENDPOINTS{RESET}\n")

# 1.1 Root endpoint
test_endpoint(
    "GET /api/ - Root endpoint",
    "GET",
    f"{BASE_URL}/",
    expected_keys=["message", "version"],
    expected_value={"version": "1.0"}
)

# 1.2 Site config
data = test_endpoint(
    "GET /api/site-config - Site configuration",
    "GET",
    f"{BASE_URL}/site-config",
    expected_keys=["brand"],
    expected_value={"brand": "Album House Prop Store"}
)

# 1.3 All products
products_data = test_endpoint(
    "GET /api/products - All products (should be 23)",
    "GET",
    f"{BASE_URL}/products",
    expected_count=23
)

# 1.4 Products by category - ready-themes
test_endpoint(
    "GET /api/products?category=ready-themes (should be 8)",
    "GET",
    f"{BASE_URL}/products?category=ready-themes",
    expected_count=8
)

# 1.5 Products by category - new-arrivals
test_endpoint(
    "GET /api/products?category=new-arrivals (should be 12)",
    "GET",
    f"{BASE_URL}/products?category=new-arrivals",
    expected_count=12
)

# 1.6 Themes
test_endpoint(
    "GET /api/themes (should be 8)",
    "GET",
    f"{BASE_URL}/themes",
    expected_count=8
)

# 1.7 All banners
test_endpoint(
    "GET /api/banners - All banners (should be 6)",
    "GET",
    f"{BASE_URL}/banners",
    expected_count=6
)

# 1.8 Hero banners
test_endpoint(
    "GET /api/banners?type=hero (should be 3)",
    "GET",
    f"{BASE_URL}/banners?type=hero",
    expected_count=3
)

# 1.9 Promo banners
test_endpoint(
    "GET /api/banners?type=promo (should be 3)",
    "GET",
    f"{BASE_URL}/banners?type=promo",
    expected_count=3
)

# 1.10 Reviews
test_endpoint(
    "GET /api/reviews (should be 8)",
    "GET",
    f"{BASE_URL}/reviews",
    expected_count=8
)

# 1.11 Stores
test_endpoint(
    "GET /api/stores (should be 2)",
    "GET",
    f"{BASE_URL}/stores",
    expected_count=2
)

# 1.12 Mentor picks
test_endpoint(
    "GET /api/mentor-picks (should be 3)",
    "GET",
    f"{BASE_URL}/mentor-picks",
    expected_count=3
)

# 1.13 Studio bookings
test_endpoint(
    "GET /api/studio-bookings (should be 3)",
    "GET",
    f"{BASE_URL}/studio-bookings",
    expected_count=3
)

# ===================== 2. ADMIN AUTH FLOW =====================
print(f"\n{YELLOW}[2] ADMIN AUTH FLOW{RESET}\n")

# 2.1 Login with wrong credentials
test_endpoint(
    "POST /api/admin/login - Wrong credentials (should be 401)",
    "POST",
    f"{BASE_URL}/admin/login",
    expected_status=401,
    json_data={"username": "wrong", "password": "wrong"}
)

# 2.2 Login with correct credentials
token_data = test_endpoint(
    "POST /api/admin/login - Correct credentials",
    "POST",
    f"{BASE_URL}/admin/login",
    json_data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
    expected_keys=["access_token", "token_type"]
)

admin_token = None
if token_data and "access_token" in token_data:
    admin_token = token_data["access_token"]
    print(f"  {GREEN}Token obtained:{RESET} {admin_token[:20]}...")

# 2.3 GET /admin/me without token
test_endpoint(
    "GET /api/admin/me - Without token (should be 401)",
    "GET",
    f"{BASE_URL}/admin/me",
    expected_status=401
)

# 2.4 GET /admin/me with token
if admin_token:
    test_endpoint(
        "GET /api/admin/me - With Bearer token",
        "GET",
        f"{BASE_URL}/admin/me",
        headers={"Authorization": f"Bearer {admin_token}"},
        expected_keys=["username"],
        expected_value={"username": ADMIN_USERNAME}
    )
else:
    result.add_fail("GET /api/admin/me - With Bearer token", "No token available from login")

# ===================== 3. ADMIN CRUD OPERATIONS =====================
print(f"\n{YELLOW}[3] ADMIN CRUD OPERATIONS{RESET}\n")

created_product_id = None

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 3.1 Create product
    new_product = {
        "name": "Test Product for API Testing",
        "tag": "Test",
        "sale": False,
        "price": 999,
        "regularPrice": 1299,
        "save": "23%",
        "image": "https://example.com/test.jpg",
        "hover": None,
        "category": "baby",
        "description": "This is a test product created by backend_test.py",
        "order": 999
    }
    
    created_product = test_endpoint(
        "POST /api/admin/products - Create product",
        "POST",
        f"{BASE_URL}/admin/products",
        headers=headers,
        json_data=new_product,
        expected_keys=["id", "name", "price"]
    )
    
    if created_product and "id" in created_product:
        created_product_id = created_product["id"]
        print(f"  {GREEN}Product created with ID:{RESET} {created_product_id}")
        
        # 3.2 Update product
        update_data = {
            "name": "Test Product UPDATED",
            "tag": "Updated",
            "sale": True,
            "price": 799,
            "regularPrice": 1299,
            "save": "38%",
            "image": "https://example.com/test-updated.jpg",
            "hover": None,
            "category": "baby",
            "description": "This product was updated by backend_test.py",
            "order": 999
        }
        
        updated_product = test_endpoint(
            "PUT /api/admin/products/{id} - Update product",
            "PUT",
            f"{BASE_URL}/admin/products/{created_product_id}",
            headers=headers,
            json_data=update_data,
            expected_keys=["id", "name", "price"]
        )
        
        # 3.3 Verify update by fetching the product
        if updated_product:
            verified_product = test_endpoint(
                "GET /api/products/{id} - Verify product update",
                "GET",
                f"{BASE_URL}/products/{created_product_id}",
                expected_value={"name": "Test Product UPDATED", "price": 799}
            )
        
        # 3.4 Delete product
        test_endpoint(
            "DELETE /api/admin/products/{id} - Delete product",
            "DELETE",
            f"{BASE_URL}/admin/products/{created_product_id}",
            headers=headers,
            expected_keys=["ok"]
        )
    else:
        result.add_fail("PUT /api/admin/products/{id}", "No product ID from create")
        result.add_fail("GET /api/products/{id}", "No product ID from create")
        result.add_fail("DELETE /api/admin/products/{id}", "No product ID from create")
    
    # 3.5 Update site config
    updated_config = {
        "brand": "Album House Prop Store",
        "tagline": "UPDATED BY TEST - Handcrafted with love.",
        "announcements": ["TEST ANNOUNCEMENT"],
        "primaryColor": "#E85A4F",
        "secondaryColor": "#0F4C5C",
        "accentColor": "#F2C94C",
        "creamColor": "#FFF8F0",
        "textColor": "#2D1B0F",
        "instagram": "https://www.instagram.com/",
        "email": "test@albumhousepropstore.com",
        "aboutText": "Test about text",
        "heroSubText": "Test hero sub text"
    }
    
    test_endpoint(
        "PUT /api/admin/site-config - Update site config",
        "PUT",
        f"{BASE_URL}/admin/site-config",
        headers=headers,
        json_data=updated_config,
        expected_keys=["brand", "tagline"]
    )
    
    # 3.6 Verify site config update
    test_endpoint(
        "GET /api/site-config - Verify config update",
        "GET",
        f"{BASE_URL}/site-config",
        expected_value={"tagline": "UPDATED BY TEST - Handcrafted with love."}
    )
    
else:
    result.add_fail("Admin CRUD operations", "No admin token available")

# ===================== 4. AI QUIZ ENDPOINT =====================
print(f"\n{YELLOW}[4] AI QUIZ ENDPOINT{RESET}\n")

# 4.1 Quiz recommendation - newborn/boho
quiz_request_1 = {
    "subject": "newborn",
    "style": "boho",
    "color": "warm",
    "setting": "studio",
    "budget": "5k-15k",
    "occasion": "first portfolio"
}

quiz_response_1 = test_endpoint(
    "POST /api/quiz/recommend - Newborn/Boho/Warm",
    "POST",
    f"{BASE_URL}/quiz/recommend",
    json_data=quiz_request_1,
    expected_keys=["title", "message", "categories", "products"]
)

if quiz_response_1:
    categories = quiz_response_1.get("categories", [])
    products = quiz_response_1.get("products", [])
    
    if len(categories) == 3:
        print(f"  {GREEN}Categories count: 3{RESET} {categories}")
    else:
        print(f"  {YELLOW}Categories count: {len(categories)}{RESET} (expected 3) {categories}")
    
    if 1 <= len(products) <= 6:
        print(f"  {GREEN}Products count: {len(products)}{RESET} (expected 1-6)")
    else:
        print(f"  {YELLOW}Products count: {len(products)}{RESET} (expected 1-6)")

# 4.2 Quiz recommendation - maternity/fairytale
quiz_request_2 = {
    "subject": "maternity",
    "style": "fairytale",
    "color": "bold",
    "setting": "studio",
    "budget": "15k-50k",
    "occasion": ""
}

quiz_response_2 = test_endpoint(
    "POST /api/quiz/recommend - Maternity/Fairytale/Bold",
    "POST",
    f"{BASE_URL}/quiz/recommend",
    json_data=quiz_request_2,
    expected_keys=["title", "message", "categories", "products"]
)

if quiz_response_2:
    categories = quiz_response_2.get("categories", [])
    products = quiz_response_2.get("products", [])
    
    if len(categories) == 3:
        print(f"  {GREEN}Categories count: 3{RESET} {categories}")
    else:
        print(f"  {YELLOW}Categories count: {len(categories)}{RESET} (expected 3) {categories}")
    
    if 1 <= len(products) <= 6:
        print(f"  {GREEN}Products count: {len(products)}{RESET} (expected 1-6)")
    else:
        print(f"  {YELLOW}Products count: {len(products)}{RESET} (expected 1-6)")

# ===================== SUMMARY =====================
success = result.summary()

if success:
    print(f"\n{GREEN}{'='*60}{RESET}")
    print(f"{GREEN}ALL TESTS PASSED ✓{RESET}")
    print(f"{GREEN}{'='*60}{RESET}\n")
    exit(0)
else:
    print(f"\n{RED}{'='*60}{RESET}")
    print(f"{RED}SOME TESTS FAILED ✗{RESET}")
    print(f"{RED}{'='*60}{RESET}\n")
    exit(1)
