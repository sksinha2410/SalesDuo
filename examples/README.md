# SalesDuo API Examples

This directory contains examples of how to use the SalesDuo API in different environments.

## Files

### 1. `api-usage.js` - Node.js Examples

A comprehensive Node.js module demonstrating all API endpoints.

**Usage:**

```bash
# As a standalone script
node examples/api-usage.js

# As a module in your code
const { processAsin, getAsinHistory } = require('./examples/api-usage.js');

// Process an ASIN
const result = await processAsin('B08N5WRWNW');

// Get history
const history = await getAsinHistory('B08N5WRWNW');
```

**Available Functions:**

- `processAsin(asin)` - Process a new ASIN and get optimization
- `getAsinHistory(asin)` - Get optimization history for an ASIN
- `getAllOptimizations(limit)` - Get all optimizations (paginated)
- `checkHealth()` - Check if API is running

---

### 2. `browser-example.html` - Browser Example

An interactive HTML page to test the API from your browser.

**Usage:**

1. Make sure the backend is running:
   ```bash
   cd backend
   npm start
   ```

2. Open the HTML file in your browser:
   ```bash
   # Mac
   open examples/browser-example.html
   
   # Linux
   xdg-open examples/browser-example.html
   
   # Windows
   start examples/browser-example.html
   ```

3. Enter an ASIN and click "Optimize ASIN"

**Features:**

- Beautiful UI with real-time results
- Health check functionality
- Error handling with user-friendly messages
- Displays optimized title, description, and keywords

---

## Quick Start

### Test with curl

```bash
# Check API health
curl http://localhost:3001/health

# Process an ASIN
curl -X POST http://localhost:3001/api/products/process \
  -H "Content-Type: application/json" \
  -d '{"asin":"B08N5WRWNW"}'

# Get history
curl http://localhost:3001/api/products/history/B08N5WRWNW

# Get all optimizations
curl http://localhost:3001/api/products/optimizations?limit=10
```

---

## Example ASINs to Try

These are popular products you can use for testing:

- `B08N5WRWNW` - Amazon Echo Dot (4th Gen)
- `B09WZF2XWR` - Apple AirPods Pro (2nd Gen)
- `B0BDJ34S6N` - Fire TV Stick 4K
- `B07YNM3F8P` - Kindle Paperwhite
- `B08J8FFJ8H` - Nintendo Switch

---

## Integration Examples

### React/Next.js

```javascript
import { useState } from 'react';

function AsinOptimizer() {
  const [asin, setAsin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/products/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={asin}
        onChange={(e) => setAsin(e.target.value)}
        placeholder="Enter ASIN"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Optimize'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
```

### Python

```python
import requests
import json

def process_asin(asin):
    url = 'http://localhost:3001/api/products/process'
    headers = {'Content-Type': 'application/json'}
    data = {'asin': asin}
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = process_asin('B08N5WRWNW')
print(json.dumps(result, indent=2))
```

### PHP

```php
<?php
function processAsin($asin) {
    $url = 'http://localhost:3001/api/products/process';
    $data = json_encode(['asin' => $asin]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ]);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($result, true);
}

// Usage
$result = processAsin('B08N5WRWNW');
print_r($result);
?>
```

---

## Error Handling

All examples include basic error handling. For production use, implement:

1. **Retry logic with exponential backoff**
   ```javascript
   async function retryWithBackoff(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
       }
     }
   }
   ```

2. **Request timeouts**
   ```javascript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 60000);
   
   fetch(url, { signal: controller.signal })
     .finally(() => clearTimeout(timeoutId));
   ```

3. **Rate limiting**
   ```javascript
   const rateLimiter = {
     tokens: 10,
     refillRate: 1,
     lastRefill: Date.now(),
     
     async acquire() {
       const now = Date.now();
       const timePassed = (now - this.lastRefill) / 1000;
       this.tokens = Math.min(10, this.tokens + timePassed * this.refillRate);
       this.lastRefill = now;
       
       if (this.tokens < 1) {
         const waitTime = (1 - this.tokens) / this.refillRate * 1000;
         await new Promise(r => setTimeout(r, waitTime));
         return this.acquire();
       }
       
       this.tokens -= 1;
     }
   };
   ```

---

## Testing

### Unit Tests (Jest Example)

```javascript
const { processAsin } = require('./api-usage');

describe('SalesDuo API', () => {
  it('should process a valid ASIN', async () => {
    const result = await processAsin('B08N5WRWNW');
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('original');
    expect(result.data).toHaveProperty('optimized');
  });
  
  it('should handle invalid ASIN', async () => {
    const result = await processAsin('INVALID');
    expect(result.success).toBe(false);
  });
});
```

---

## Performance Tips

1. **Caching**: Cache results to avoid redundant API calls
2. **Parallel Processing**: Process multiple ASINs concurrently
3. **Batch Operations**: Group requests when possible
4. **Compression**: Enable gzip for API responses
5. **CDN**: Use CDN for static assets in production

---

## Security Considerations

When using these examples in production:

1. **Never expose API keys** in client-side code
2. **Use environment variables** for configuration
3. **Implement authentication** for your API
4. **Validate all inputs** before sending to API
5. **Use HTTPS** in production
6. **Implement rate limiting** to prevent abuse

---

## Support

For more information:

- **API Documentation**: See [API.md](../API.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
- **Issues**: [GitHub Issues](https://github.com/sksinha2410/SalesDuo/issues)

---

## Contributing

Have a better example? Contributions are welcome!

1. Fork the repository
2. Add your example
3. Update this README
4. Submit a pull request

---

Happy coding! 🚀
