# SalesDuo Troubleshooting Guide

This guide helps you resolve common issues with SalesDuo.

## Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Database Issues](#database-issues)
4. [Scraping Issues](#scraping-issues)
5. [OpenAI API Issues](#openai-api-issues)
6. [Docker Issues](#docker-issues)
7. [General Issues](#general-issues)

---

## Backend Issues

### Backend Won't Start

**Symptom:** `npm start` fails or backend crashes immediately

**Solutions:**

1. **Check Node.js version**
   ```bash
   node --version  # Should be v14 or higher
   ```

2. **Verify dependencies are installed**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check .env file**
   ```bash
   # Ensure .env exists and has all required variables
   cat .env
   ```

4. **Check for port conflicts**
   ```bash
   # Check if port 3001 is in use
   lsof -i :3001
   # Kill the process if needed
   kill -9 <PID>
   ```

5. **Check syntax errors**
   ```bash
   node -c src/index.js
   ```

---

### "Database connection failed" Error

**Symptom:** `Database connection failed: <error message>`

**Solutions:**

1. **Verify MySQL is running**
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   # or
   ps aux | grep mysql
   ```

2. **Check database credentials in .env**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=salesduo
   ```

3. **Test database connection**
   ```bash
   mysql -h localhost -u root -p
   # Then try to use the database
   USE salesduo;
   ```

4. **Ensure database exists**
   ```bash
   mysql -u root -p < backend/db/schema.sql
   ```

---

### "OpenAI API key is invalid" Error

**Symptom:** AI optimization fails with API key error

**Solutions:**

1. **Verify API key is set**
   ```bash
   grep OPENAI_API_KEY backend/.env
   ```

2. **Check API key format**
   - Should start with `sk-`
   - No quotes needed in .env
   - No spaces

3. **Verify API key is active**
   - Log into OpenAI dashboard
   - Check API keys section
   - Regenerate if necessary

4. **Check OpenAI account status**
   - Ensure you have sufficient credits
   - Verify account is not suspended

---

### High Memory Usage

**Symptom:** Backend consumes too much memory

**Solutions:**

1. **Restart the backend**
   ```bash
   pm2 restart salesduo-backend
   # or
   npm start
   ```

2. **Check for memory leaks**
   ```bash
   node --inspect src/index.js
   # Use Chrome DevTools for profiling
   ```

3. **Limit concurrent requests**
   - Implement request queuing
   - Add rate limiting

---

## Frontend Issues

### "Cannot connect to backend" Error

**Symptom:** API requests fail from frontend

**Solutions:**

1. **Verify backend is running**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check API URL in frontend .env**
   ```bash
   cat frontend/.env
   # Should be: REACT_APP_API_URL=http://localhost:3001/api
   ```

3. **Check CORS settings**
   - Backend should allow frontend origin
   - Check browser console for CORS errors

4. **Verify network connectivity**
   ```bash
   # From frontend directory
   curl http://localhost:3001/api/products/optimizations
   ```

---

### Build Fails

**Symptom:** `npm run build` fails with errors

**Solutions:**

1. **Check for linting errors**
   ```bash
   cd frontend
   npm run build 2>&1 | less
   ```

2. **Fix ESLint warnings**
   - React hooks dependencies
   - Unused variables
   - Import errors

3. **Clear cache and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Check Node.js version**
   ```bash
   node --version  # Should be v14 or higher
   ```

---

### Blank Page After Deployment

**Symptom:** Frontend shows blank page in production

**Solutions:**

1. **Check browser console**
   - Look for JavaScript errors
   - Check for 404 errors on assets

2. **Verify build directory**
   ```bash
   ls -la frontend/build
   # Should contain index.html and static/
   ```

3. **Check server configuration**
   - Ensure server is serving index.html for all routes
   - Verify correct root directory

4. **Check API URL**
   - Ensure production API URL is set correctly
   - Verify backend is accessible from production

---

## Database Issues

### "Table doesn't exist" Error

**Symptom:** Database queries fail with table not found

**Solutions:**

1. **Run schema creation**
   ```bash
   mysql -u root -p salesduo < backend/db/schema.sql
   ```

2. **Verify table exists**
   ```sql
   USE salesduo;
   SHOW TABLES;
   DESCRIBE product_optimizations;
   ```

3. **Check database name**
   - Ensure DB_NAME in .env matches actual database

---

### "JSON parse error" in Database

**Symptom:** Error parsing JSON fields

**Solutions:**

1. **Ensure MySQL version supports JSON**
   ```bash
   mysql --version  # Should be 5.7 or higher
   ```

2. **Check data integrity**
   ```sql
   SELECT id, asin, original_bullet_points 
   FROM product_optimizations 
   WHERE original_bullet_points IS NOT NULL
   LIMIT 5;
   ```

---

### Database Connection Pool Exhausted

**Symptom:** "Too many connections" error

**Solutions:**

1. **Increase connection limit in MySQL**
   ```sql
   SET GLOBAL max_connections = 200;
   ```

2. **Adjust pool settings in code**
   ```javascript
   // In src/config/database.js
   connectionLimit: 10  // Decrease if needed
   ```

3. **Check for connection leaks**
   - Ensure connections are released after use
   - Check for long-running queries

---

## Scraping Issues

### "Product not found" Error

**Symptom:** Unable to fetch product data from Amazon

**Solutions:**

1. **Verify ASIN is valid**
   - Check ASIN on Amazon.com
   - Ensure it's an active product
   - Try the ASIN in a browser: `https://www.amazon.com/dp/ASIN`

2. **Check Amazon availability**
   - Some products may be region-locked
   - Some products may be removed

---

### "Request timeout" Error

**Symptom:** Scraping takes too long and times out

**Solutions:**

1. **Increase timeout**
   ```javascript
   // In src/services/scraper.js
   timeout: 30000  // Increase to 30 seconds
   ```

2. **Check network connection**
   ```bash
   curl -I https://www.amazon.com
   ```

3. **Use proxy (if being blocked)**
   ```javascript
   // In axios request
   proxy: {
     host: 'proxy-server',
     port: 8080
   }
   ```

---

### Amazon Blocking Requests

**Symptom:** Getting 503 errors or CAPTCHAs

**Solutions:**

1. **Rotate User-Agent**
   - Update USER_AGENT in .env
   - Use different browser user agents

2. **Add delays between requests**
   ```javascript
   // Wait between requests
   await new Promise(resolve => setTimeout(resolve, 5000));
   ```

3. **Use Amazon Product Advertising API**
   - Apply for API access
   - Use official API instead of scraping

4. **Consider scraping alternatives**
   - Use commercial APIs (ScraperAPI, Bright Data)
   - Implement proxy rotation
   - Use headless browser (Puppeteer with stealth plugins)

---

## OpenAI API Issues

### Rate Limit Exceeded

**Symptom:** "Rate limit reached for requests"

**Solutions:**

1. **Wait and retry**
   - Rate limits reset after a period
   - Implement exponential backoff

2. **Check usage dashboard**
   - Log into OpenAI platform
   - Check current usage and limits

3. **Upgrade API plan**
   - Consider higher tier for more requests

4. **Implement caching**
   - Cache optimization results
   - Avoid reprocessing same content

---

### "Insufficient credits" Error

**Symptom:** API calls fail due to no credits

**Solutions:**

1. **Add credits to OpenAI account**
   - Go to OpenAI billing
   - Add payment method and credits

2. **Check billing settings**
   - Ensure auto-recharge is enabled
   - Verify payment method is valid

---

### Poor Quality Optimizations

**Symptom:** AI generates low-quality or irrelevant content

**Solutions:**

1. **Improve prompts**
   - Add more context
   - Be more specific in instructions
   - Provide examples

2. **Adjust temperature**
   ```javascript
   // In src/services/aiOptimizer.js
   temperature: 0.7  // Lower for more focused output
   ```

3. **Increase max_tokens**
   ```javascript
   max_tokens: 2000  // Allow longer responses
   ```

4. **Try different model**
   ```javascript
   model: "gpt-4"  // More capable but more expensive
   ```

---

## Docker Issues

### Containers Won't Start

**Symptom:** `docker-compose up` fails

**Solutions:**

1. **Check Docker is running**
   ```bash
   docker ps
   ```

2. **Check logs**
   ```bash
   docker-compose logs
   ```

3. **Remove old containers**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

4. **Check port conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :3001
   lsof -i :3306
   ```

---

### Database Container Issues

**Symptom:** MySQL container fails to start or connect

**Solutions:**

1. **Check container logs**
   ```bash
   docker-compose logs mysql
   ```

2. **Remove volume and restart**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Verify environment variables**
   ```bash
   cat .env
   ```

4. **Wait for initialization**
   - MySQL may take time to initialize
   - Check logs for "ready for connections"

---

## General Issues

### Module Not Found Errors

**Symptom:** "Cannot find module 'xyz'"

**Solutions:**

1. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear npm cache**
   ```bash
   npm cache clean --force
   npm install
   ```

---

### Port Already in Use

**Symptom:** "EADDRINUSE: address already in use"

**Solutions:**

1. **Find and kill process**
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill it
   kill -9 <PID>
   ```

2. **Change port**
   ```bash
   # In backend/.env
   PORT=3002
   ```

---

### Permission Denied Errors

**Symptom:** Permission errors when installing or running

**Solutions:**

1. **Fix npm permissions**
   ```bash
   sudo chown -R $USER:$USER ~/.npm
   sudo chown -R $USER:$USER .
   ```

2. **Don't use sudo with npm**
   - Configure npm to use user directory
   - Never run `sudo npm install`

---

### Slow Performance

**Symptom:** Application is slow to respond

**Solutions:**

1. **Check system resources**
   ```bash
   top
   # or
   htop
   ```

2. **Monitor database queries**
   ```sql
   SHOW PROCESSLIST;
   ```

3. **Enable caching**
   - Add Redis for API response caching
   - Cache AI optimization results

4. **Optimize database**
   ```sql
   OPTIMIZE TABLE product_optimizations;
   ```

---

## Getting Help

If you're still experiencing issues:

1. **Check logs**
   - Backend: `pm2 logs` or console output
   - Frontend: Browser console
   - Database: MySQL error logs
   - Docker: `docker-compose logs`

2. **Search existing issues**
   - Check GitHub Issues
   - Search Stack Overflow

3. **Create a new issue**
   - Provide error messages
   - Include environment details
   - Share relevant logs
   - Describe steps to reproduce

4. **Contact support**
   - Open a GitHub issue
   - Provide detailed information
   - Include troubleshooting steps already tried

---

## Debugging Tips

1. **Enable verbose logging**
   ```javascript
   // Add to backend code
   console.log('Debug:', variable);
   ```

2. **Use debugging tools**
   ```bash
   # Node.js debugger
   node --inspect src/index.js
   ```

3. **Test individual components**
   - Test scraper separately
   - Test AI service separately
   - Test database separately

4. **Use curl for API testing**
   ```bash
   curl -X POST http://localhost:3001/api/products/process \
     -H "Content-Type: application/json" \
     -d '{"asin":"B08N5WRWNW"}'
   ```

5. **Monitor network requests**
   - Use browser DevTools Network tab
   - Check request/response details

---

## Preventive Measures

1. **Regular backups**
   - Backup database regularly
   - Version control code

2. **Monitoring**
   - Set up uptime monitoring
   - Monitor error rates
   - Track API usage

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

4. **Test before deploying**
   - Test locally first
   - Use staging environment
   - Run tests

5. **Document issues**
   - Keep track of solutions
   - Update this guide
   - Share with team

---

Remember: Most issues can be resolved by checking logs first!
