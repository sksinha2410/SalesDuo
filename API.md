# SalesDuo API Documentation

Base URL: `http://localhost:3001/api`

## Endpoints

### 1. Process ASIN

Process a new ASIN by scraping Amazon data and optimizing with AI.

**Endpoint:** `POST /products/process`

**Request Body:**
```json
{
  "asin": "B08N5WRWNW"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "asin": "B08N5WRWNW",
    "original": {
      "title": "Original Product Title from Amazon",
      "bulletPoints": [
        "Original bullet point 1",
        "Original bullet point 2",
        "Original bullet point 3"
      ],
      "description": "Original product description from Amazon..."
    },
    "optimized": {
      "title": "Optimized Product Title with Keywords",
      "bulletPoints": [
        "Optimized bullet point 1 highlighting benefits",
        "Optimized bullet point 2 with clear value",
        "Optimized bullet point 3 addressing pain points",
        "Optimized bullet point 4 with features",
        "Optimized bullet point 5 with call to action"
      ],
      "description": "Enhanced product description that is engaging, persuasive, and compliant with Amazon's guidelines...",
      "keywords": [
        "keyword1",
        "keyword2",
        "keyword3",
        "keyword4",
        "keyword5"
      ]
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Product not found. Please check the ASIN."
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid ASIN format
- `500 Internal Server Error` - Scraping or AI processing failed

---

### 2. Get ASIN History

Retrieve all past optimizations for a specific ASIN.

**Endpoint:** `GET /products/history/:asin`

**Parameters:**
- `asin` (path parameter) - The Amazon ASIN

**Example:** `GET /products/history/B08N5WRWNW`

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "asin": "B08N5WRWNW",
      "original_title": "Original Title",
      "original_bullet_points": ["point1", "point2"],
      "original_description": "Original description",
      "optimized_title": "Optimized Title",
      "optimized_bullet_points": ["opt1", "opt2", "opt3", "opt4", "opt5"],
      "optimized_description": "Optimized description",
      "suggested_keywords": ["keyword1", "keyword2"],
      "created_at": "2024-12-05T10:30:00.000Z"
    },
    {
      "id": 1,
      "asin": "B08N5WRWNW",
      "original_title": "Earlier Original Title",
      "original_bullet_points": ["point1", "point2"],
      "original_description": "Earlier original description",
      "optimized_title": "Earlier Optimized Title",
      "optimized_bullet_points": ["opt1", "opt2", "opt3", "opt4", "opt5"],
      "optimized_description": "Earlier optimized description",
      "suggested_keywords": ["keyword1", "keyword2"],
      "created_at": "2024-12-04T15:20:00.000Z"
    }
  ]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Failed to fetch history"
}
```

**Status Codes:**
- `200 OK` - Success (returns empty array if no history)
- `400 Bad Request` - ASIN not provided
- `500 Internal Server Error` - Database error

---

### 3. Get All Optimizations

Retrieve a paginated list of all optimizations.

**Endpoint:** `GET /products/optimizations`

**Query Parameters:**
- `limit` (optional, default: 50) - Number of results per page (1-100)
- `offset` (optional, default: 0) - Number of results to skip

**Example:** `GET /products/optimizations?limit=20&offset=0`

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "asin": "B08N5WRWNW",
      "original_title": "Original Title",
      "optimized_title": "Optimized Title",
      "created_at": "2024-12-05T10:30:00.000Z"
    },
    {
      "id": 2,
      "asin": "B07XQXZXZ",
      "original_title": "Another Product",
      "optimized_title": "Optimized Another Product",
      "created_at": "2024-12-05T09:15:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 4. Get Optimization by ID

Retrieve detailed information about a specific optimization.

**Endpoint:** `GET /products/optimization/:id`

**Parameters:**
- `id` (path parameter) - The optimization ID

**Example:** `GET /products/optimization/1`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "asin": "B08N5WRWNW",
    "original_title": "Original Product Title",
    "original_bullet_points": ["point1", "point2", "point3"],
    "original_description": "Original description...",
    "optimized_title": "Optimized Product Title",
    "optimized_bullet_points": ["opt1", "opt2", "opt3", "opt4", "opt5"],
    "optimized_description": "Optimized description...",
    "suggested_keywords": ["keyword1", "keyword2", "keyword3"],
    "created_at": "2024-12-05T10:30:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "error": "Optimization not found"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - ID not provided
- `404 Not Found` - Optimization not found
- `500 Internal Server Error` - Database error

---

### 5. Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "message": "SalesDuo API is running"
}
```

**Status Codes:**
- `200 OK` - API is healthy

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Messages

**Scraping Errors:**
- `"Invalid ASIN format"` - ASIN is missing or invalid
- `"Product not found. Please check the ASIN."` - ASIN doesn't exist on Amazon
- `"Unable to connect to Amazon. Please check your internet connection."` - Network error
- `"Request timeout. Amazon may be blocking requests. Please try again later."` - Timeout or rate limiting

**AI Errors:**
- `"OpenAI API key is invalid or missing. Please check your configuration."` - Invalid API key
- `"AI optimization failed: [details]"` - General AI processing error

**Database Errors:**
- `"Failed to save optimization to database"` - Database write error
- `"Failed to fetch optimization history"` - Database read error

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production:
- Consider implementing rate limiting to prevent abuse
- Amazon may block excessive scraping requests
- OpenAI has its own rate limits based on your plan

---

## Authentication

Currently, the API does not require authentication. For production use:
- Implement JWT or API key authentication
- Add user management
- Track usage per user

---

## CORS

CORS is enabled for all origins in development. For production:
- Restrict CORS to specific domains
- Configure allowed methods and headers

---

## Best Practices

1. **Caching:** Consider caching results to avoid redundant scraping and AI calls
2. **Error Handling:** Always check the `success` field in responses
3. **Timeouts:** Set appropriate timeouts for scraping operations (they can take 10-30 seconds)
4. **Validation:** Validate ASIN format before making requests
5. **Retry Logic:** Implement retry logic with exponential backoff for failed requests

---

## Example Usage

### JavaScript (Fetch API)

```javascript
// Process ASIN
async function processAsin(asin) {
  try {
    const response = await fetch('http://localhost:3001/api/products/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asin }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Optimization successful:', data.data);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Get history
async function getHistory(asin) {
  try {
    const response = await fetch(`http://localhost:3001/api/products/history/${asin}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('History:', data.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### cURL

```bash
# Process ASIN
curl -X POST http://localhost:3001/api/products/process \
  -H "Content-Type: application/json" \
  -d '{"asin":"B08N5WRWNW"}'

# Get history
curl http://localhost:3001/api/products/history/B08N5WRWNW

# Get all optimizations
curl http://localhost:3001/api/products/optimizations?limit=10&offset=0
```
