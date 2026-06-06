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

# 1.14 Navigation - NEW endpoint
nav_data = test_endpoint(
    "GET /api/navigation (should be 7)",
    "GET",
    f"{BASE_URL}/navigation",
    expected_count=7
)

if nav_data and len(nav_data) > 0:
    # Verify structure of first nav item
    first_nav = nav_data[0]
    required_fields = ["id", "label", "href", "highlight", "order", "columns"]
    missing_fields = [f for f in required_fields if f not in first_nav]
    if missing_fields:
        print(f"  {YELLOW}Warning: Navigation item missing fields: {missing_fields}{RESET}")
    else:
        print(f"  {GREEN}Navigation structure verified{RESET}")

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

# ===================== 5. NEW ADMIN CRUD - NAVIGATION =====================
print(f"\n{YELLOW}[5] NEW ADMIN CRUD - NAVIGATION{RESET}\n")

created_nav_id = None

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 5.1 Test without token - should be 401
    test_endpoint(
        "POST /api/admin/navigation - Without token (should be 401)",
        "POST",
        f"{BASE_URL}/admin/navigation",
        expected_status=401,
        json_data={"label": "Test", "href": "/shop"}
    )
    
    # 5.2 Create navigation
    new_nav = {
        "label": "Sale",
        "href": "/shop?q=Sale",
        "highlight": False,
        "order": 99,
        "columns": [
            {
                "title": "Hot",
                "items": [
                    {"label": "Under 999", "href": "/shop?q=Filler"}
                ]
            }
        ]
    }
    
    created_nav = test_endpoint(
        "POST /api/admin/navigation - Create navigation",
        "POST",
        f"{BASE_URL}/admin/navigation",
        headers=headers,
        json_data=new_nav,
        expected_keys=["id", "label", "href", "columns"]
    )
    
    if created_nav and "id" in created_nav:
        created_nav_id = created_nav["id"]
        print(f"  {GREEN}Navigation created with ID:{RESET} {created_nav_id}")
        
        # 5.3 Update navigation
        update_nav = {
            "label": "Big Sale",
            "href": "/shop?q=BigSale",
            "highlight": True,
            "order": 99,
            "columns": [
                {
                    "title": "Hot Deals",
                    "items": [
                        {"label": "Under 999", "href": "/shop?q=Filler"},
                        {"label": "Under 4999", "href": "/shop?q=Mini"}
                    ]
                }
            ]
        }
        
        updated_nav = test_endpoint(
            "PUT /api/admin/navigation/{id} - Update navigation",
            "PUT",
            f"{BASE_URL}/admin/navigation/{created_nav_id}",
            headers=headers,
            json_data=update_nav,
            expected_keys=["id", "label"]
        )
        
        # 5.4 Verify update by listing navigation
        if updated_nav:
            all_nav = test_endpoint(
                "GET /api/navigation - Verify navigation update",
                "GET",
                f"{BASE_URL}/navigation"
            )
            if all_nav:
                found = any(n.get("id") == created_nav_id and n.get("label") == "Big Sale" for n in all_nav)
                if found:
                    print(f"  {GREEN}Navigation update verified in list{RESET}")
                else:
                    print(f"  {YELLOW}Warning: Updated navigation not found in list{RESET}")
        
        # 5.5 Delete navigation
        test_endpoint(
            "DELETE /api/admin/navigation/{id} - Delete navigation",
            "DELETE",
            f"{BASE_URL}/admin/navigation/{created_nav_id}",
            headers=headers,
            expected_keys=["ok"]
        )
        
        # 5.6 Test delete without token - should be 401
        test_endpoint(
            "DELETE /api/admin/navigation/{id} - Without token (should be 401)",
            "DELETE",
            f"{BASE_URL}/admin/navigation/{created_nav_id}",
            expected_status=401
        )
    else:
        result.add_fail("PUT /api/admin/navigation/{id}", "No navigation ID from create")
        result.add_fail("DELETE /api/admin/navigation/{id}", "No navigation ID from create")
else:
    result.add_fail("Admin Navigation CRUD", "No admin token available")

# ===================== 6. NEW ADMIN CRUD - STORES =====================
print(f"\n{YELLOW}[6] NEW ADMIN CRUD - STORES{RESET}\n")

created_store_id = None

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 6.1 Test without token - should be 401
    test_endpoint(
        "POST /api/admin/stores - Without token (should be 401)",
        "POST",
        f"{BASE_URL}/admin/stores",
        expected_status=401,
        json_data={"name": "Test", "image": "test.jpg"}
    )
    
    # 6.2 Create store
    new_store = {
        "name": "Test Store",
        "image": "https://example.com/img.jpg",
        "address": "Test address",
        "phone": "+91-1234567890",
        "extra": "",
        "hours": "Mon-Sat 10-6"
    }
    
    created_store = test_endpoint(
        "POST /api/admin/stores - Create store",
        "POST",
        f"{BASE_URL}/admin/stores",
        headers=headers,
        json_data=new_store,
        expected_keys=["id", "name", "address", "phone"]
    )
    
    if created_store and "id" in created_store:
        created_store_id = created_store["id"]
        print(f"  {GREEN}Store created with ID:{RESET} {created_store_id}")
        
        # 6.3 Update store
        update_store = {
            "name": "Updated Test Store",
            "image": "https://example.com/img-updated.jpg",
            "address": "Updated test address",
            "phone": "+91-9876543210",
            "extra": "Extra info",
            "hours": "Mon-Sun 9-7"
        }
        
        updated_store = test_endpoint(
            "PUT /api/admin/stores/{id} - Update store",
            "PUT",
            f"{BASE_URL}/admin/stores/{created_store_id}",
            headers=headers,
            json_data=update_store,
            expected_keys=["id", "name"]
        )
        
        # 6.4 Verify update by listing stores
        if updated_store:
            all_stores = test_endpoint(
                "GET /api/stores - Verify store update",
                "GET",
                f"{BASE_URL}/stores"
            )
            if all_stores:
                found = any(s.get("id") == created_store_id and s.get("name") == "Updated Test Store" for s in all_stores)
                if found:
                    print(f"  {GREEN}Store update verified in list{RESET}")
                else:
                    print(f"  {YELLOW}Warning: Updated store not found in list{RESET}")
        
        # 6.5 Delete store
        test_endpoint(
            "DELETE /api/admin/stores/{id} - Delete store",
            "DELETE",
            f"{BASE_URL}/admin/stores/{created_store_id}",
            headers=headers,
            expected_keys=["ok"]
        )
        
        # 6.6 Test delete without token - should be 401
        test_endpoint(
            "DELETE /api/admin/stores/{id} - Without token (should be 401)",
            "DELETE",
            f"{BASE_URL}/admin/stores/{created_store_id}",
            expected_status=401
        )
    else:
        result.add_fail("PUT /api/admin/stores/{id}", "No store ID from create")
        result.add_fail("DELETE /api/admin/stores/{id}", "No store ID from create")
else:
    result.add_fail("Admin Stores CRUD", "No admin token available")

# ===================== 7. UPDATED ADMIN CRUD - MENTOR PICKS (NEW PUT) =====================
print(f"\n{YELLOW}[7] UPDATED ADMIN CRUD - MENTOR PICKS (NEW PUT){RESET}\n")

created_mentor_id = None

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 7.1 Test without token - should be 401
    test_endpoint(
        "POST /api/admin/mentor-picks - Without token (should be 401)",
        "POST",
        f"{BASE_URL}/admin/mentor-picks",
        expected_status=401,
        json_data={"name": "Test", "image": "test.jpg"}
    )
    
    # 7.2 Create mentor pick
    new_mentor = {
        "name": "Test Mentor",
        "image": "https://example.com/img.jpg",
        "href": "/shop",
        "order": 99
    }
    
    created_mentor = test_endpoint(
        "POST /api/admin/mentor-picks - Create mentor pick",
        "POST",
        f"{BASE_URL}/admin/mentor-picks",
        headers=headers,
        json_data=new_mentor,
        expected_keys=["id", "name", "image"]
    )
    
    if created_mentor and "id" in created_mentor:
        created_mentor_id = created_mentor["id"]
        print(f"  {GREEN}Mentor pick created with ID:{RESET} {created_mentor_id}")
        
        # 7.3 Update mentor pick (NEW PUT endpoint)
        update_mentor = {
            "name": "Updated Test Mentor",
            "image": "https://example.com/img-updated.jpg",
            "href": "/shop?updated",
            "order": 98
        }
        
        updated_mentor = test_endpoint(
            "PUT /api/admin/mentor-picks/{id} - Update mentor pick (NEW)",
            "PUT",
            f"{BASE_URL}/admin/mentor-picks/{created_mentor_id}",
            headers=headers,
            json_data=update_mentor,
            expected_keys=["id", "name"]
        )
        
        # 7.4 Verify update by listing mentor picks
        if updated_mentor:
            all_mentors = test_endpoint(
                "GET /api/mentor-picks - Verify mentor pick update",
                "GET",
                f"{BASE_URL}/mentor-picks"
            )
            if all_mentors:
                found = any(m.get("id") == created_mentor_id and m.get("name") == "Updated Test Mentor" for m in all_mentors)
                if found:
                    print(f"  {GREEN}Mentor pick update verified in list{RESET}")
                else:
                    print(f"  {YELLOW}Warning: Updated mentor pick not found in list{RESET}")
        
        # 7.5 Delete mentor pick
        test_endpoint(
            "DELETE /api/admin/mentor-picks/{id} - Delete mentor pick",
            "DELETE",
            f"{BASE_URL}/admin/mentor-picks/{created_mentor_id}",
            headers=headers,
            expected_keys=["ok"]
        )
    else:
        result.add_fail("PUT /api/admin/mentor-picks/{id}", "No mentor pick ID from create")
        result.add_fail("DELETE /api/admin/mentor-picks/{id}", "No mentor pick ID from create")
else:
    result.add_fail("Admin Mentor Picks CRUD", "No admin token available")

# ===================== 8. UPDATED ADMIN CRUD - STUDIO BOOKINGS (NEW PUT) =====================
print(f"\n{YELLOW}[8] UPDATED ADMIN CRUD - STUDIO BOOKINGS (NEW PUT){RESET}\n")

created_booking_id = None

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 8.1 Test without token - should be 401
    test_endpoint(
        "POST /api/admin/studio-bookings - Without token (should be 401)",
        "POST",
        f"{BASE_URL}/admin/studio-bookings",
        expected_status=401,
        json_data={"line1": "Test", "heading": "Test"}
    )
    
    # 8.2 Create studio booking
    new_booking = {
        "line1": "Test",
        "heading": "Call test",
        "sub": "sub",
        "cta": "Book",
        "image": "https://example.com/img.jpg",
        "whatsapp": "918888888888",
        "order": 99
    }
    
    created_booking = test_endpoint(
        "POST /api/admin/studio-bookings - Create studio booking",
        "POST",
        f"{BASE_URL}/admin/studio-bookings",
        headers=headers,
        json_data=new_booking,
        expected_keys=["id", "heading", "whatsapp"]
    )
    
    if created_booking and "id" in created_booking:
        created_booking_id = created_booking["id"]
        print(f"  {GREEN}Studio booking created with ID:{RESET} {created_booking_id}")
        
        # 8.3 Update studio booking (NEW PUT endpoint)
        update_booking = {
            "line1": "Updated Test",
            "heading": "Updated Call test",
            "sub": "updated sub",
            "cta": "Book Now",
            "image": "https://example.com/img-updated.jpg",
            "whatsapp": "919999999999",
            "order": 98
        }
        
        updated_booking = test_endpoint(
            "PUT /api/admin/studio-bookings/{id} - Update studio booking (NEW)",
            "PUT",
            f"{BASE_URL}/admin/studio-bookings/{created_booking_id}",
            headers=headers,
            json_data=update_booking,
            expected_keys=["id", "heading"]
        )
        
        # 8.4 Verify update by listing studio bookings
        if updated_booking:
            all_bookings = test_endpoint(
                "GET /api/studio-bookings - Verify studio booking update",
                "GET",
                f"{BASE_URL}/studio-bookings"
            )
            if all_bookings:
                found = any(b.get("id") == created_booking_id and b.get("heading") == "Updated Call test" for b in all_bookings)
                if found:
                    print(f"  {GREEN}Studio booking update verified in list{RESET}")
                else:
                    print(f"  {YELLOW}Warning: Updated studio booking not found in list{RESET}")
        
        # 8.5 Delete studio booking
        test_endpoint(
            "DELETE /api/admin/studio-bookings/{id} - Delete studio booking",
            "DELETE",
            f"{BASE_URL}/admin/studio-bookings/{created_booking_id}",
            headers=headers,
            expected_keys=["ok"]
        )
    else:
        result.add_fail("PUT /api/admin/studio-bookings/{id}", "No studio booking ID from create")
        result.add_fail("DELETE /api/admin/studio-bookings/{id}", "No studio booking ID from create")
else:
    result.add_fail("Admin Studio Bookings CRUD", "No admin token available")

# ===================== 9. UPDATED ADMIN CRUD - REVIEWS (NEW PUT) =====================
print(f"\n{YELLOW}[9] UPDATED ADMIN CRUD - REVIEWS (NEW PUT){RESET}\n")

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 9.1 First, get existing reviews to test PUT
    existing_reviews = test_endpoint(
        "GET /api/reviews - Get existing reviews for PUT test",
        "GET",
        f"{BASE_URL}/reviews"
    )
    
    if existing_reviews and len(existing_reviews) > 0:
        # Get first review ID
        first_review_id = existing_reviews[0].get("id")
        original_title = existing_reviews[0].get("title")
        
        if first_review_id:
            print(f"  {GREEN}Using existing review ID for PUT test:{RESET} {first_review_id}")
            
            # 9.2 Update review (NEW PUT endpoint)
            update_review = {
                "stars": 5,
                "title": "UPDATED TEST TITLE",
                "body": existing_reviews[0].get("body", "Test body"),
                "author": existing_reviews[0].get("author", "Test Author"),
                "date": existing_reviews[0].get("date", "2024-01-01"),
                "product": existing_reviews[0].get("product", "Test Product")
            }
            
            updated_review = test_endpoint(
                "PUT /api/admin/reviews/{id} - Update review (NEW)",
                "PUT",
                f"{BASE_URL}/admin/reviews/{first_review_id}",
                headers=headers,
                json_data=update_review,
                expected_keys=["id", "title"]
            )
            
            # 9.3 Verify update by getting reviews
            if updated_review:
                all_reviews = test_endpoint(
                    "GET /api/reviews - Verify review update",
                    "GET",
                    f"{BASE_URL}/reviews"
                )
                if all_reviews:
                    found = any(r.get("id") == first_review_id and r.get("title") == "UPDATED TEST TITLE" for r in all_reviews)
                    if found:
                        print(f"  {GREEN}Review update verified in list{RESET}")
                    else:
                        print(f"  {YELLOW}Warning: Updated review not found in list{RESET}")
                
                # 9.4 Restore original title
                restore_review = {
                    "stars": existing_reviews[0].get("stars", 5),
                    "title": original_title,
                    "body": existing_reviews[0].get("body", "Test body"),
                    "author": existing_reviews[0].get("author", "Test Author"),
                    "date": existing_reviews[0].get("date", "2024-01-01"),
                    "product": existing_reviews[0].get("product", "Test Product")
                }
                
                test_endpoint(
                    "PUT /api/admin/reviews/{id} - Restore original title",
                    "PUT",
                    f"{BASE_URL}/admin/reviews/{first_review_id}",
                    headers=headers,
                    json_data=restore_review,
                    expected_keys=["id", "title"]
                )
                print(f"  {GREEN}Original review title restored{RESET}")
        else:
            result.add_fail("PUT /api/admin/reviews/{id}", "No review ID found in existing reviews")
    else:
        result.add_fail("PUT /api/admin/reviews/{id}", "No existing reviews to test PUT")
    
    # 9.5 Test CREATE and DELETE for reviews
    new_review = {
        "stars": 5,
        "title": "Test Review for API Testing",
        "body": "This is a test review created by backend_test.py",
        "author": "Test Author",
        "date": "2024-01-15",
        "product": "Test Product"
    }
    
    created_review = test_endpoint(
        "POST /api/admin/reviews - Create review",
        "POST",
        f"{BASE_URL}/admin/reviews",
        headers=headers,
        json_data=new_review,
        expected_keys=["id", "title", "author"]
    )
    
    if created_review and "id" in created_review:
        created_review_id = created_review["id"]
        print(f"  {GREEN}Review created with ID:{RESET} {created_review_id}")
        
        # 9.6 Delete the test review
        test_endpoint(
            "DELETE /api/admin/reviews/{id} - Delete review",
            "DELETE",
            f"{BASE_URL}/admin/reviews/{created_review_id}",
            headers=headers,
            expected_keys=["ok"]
        )
    else:
        result.add_fail("DELETE /api/admin/reviews/{id}", "No review ID from create")
else:
    result.add_fail("Admin Reviews CRUD", "No admin token available")

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
