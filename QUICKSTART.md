# SalesDuo Quick Start Guide

Get SalesDuo up and running in under 10 minutes!

## Prerequisites

- [x] Node.js v14+ ([Download](https://nodejs.org/))
- [x] MySQL v5.7+ ([Download](https://dev.mysql.com/downloads/))
- [x] OpenAI API Key ([Get one](https://platform.openai.com/api-keys))

---

## Option 1: Automated Setup (Recommended)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/sksinha2410/SalesDuo.git
cd SalesDuo

# Run the setup script
./setup.sh
```

### 2. Configure Database

```bash
# Create database
mysql -u root -p
```

In MySQL:
```sql
CREATE DATABASE salesduo;
EXIT;
```

```bash
# Import schema
mysql -u root -p salesduo < backend/db/schema.sql
```

### 3. Add Your API Key

```bash
# Edit backend/.env
nano backend/.env
```

Update these lines:
```env
DB_PASSWORD=your_mysql_password
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Open in Browser

Go to: **http://localhost:3000**

🎉 **Done!** Enter an Amazon ASIN to start optimizing!

---

## Option 2: Docker Setup (Even Easier!)

### 1. Clone Repository

```bash
git clone https://github.com/sksinha2410/SalesDuo.git
cd SalesDuo
```

### 2. Create .env File

```bash
echo "OPENAI_API_KEY=your_openai_api_key" > .env
```

### 3. Start with Docker

```bash
docker-compose up -d
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:3306

### 5. View Logs (Optional)

```bash
docker-compose logs -f
```

🎉 **Done!** That's it!

---

## Testing the Application

### 1. Enter an ASIN

Try one of these popular ASINs:
- `B08N5WRWNW` - Amazon Echo Dot
- `B09WZF2XWR` - Apple AirPods Pro
- `B0BDJ34S6N` - Fire TV Stick

### 2. Click "Optimize"

Wait 20-30 seconds while:
- Product data is scraped from Amazon
- AI generates optimized content
- Results are saved to database

### 3. View Results

See the side-by-side comparison:
- **Left:** Original Amazon listing
- **Right:** AI-optimized version with keywords

### 4. Check History

Past optimizations for the same ASIN appear below the results.

---

## Quick Tips

✅ **Valid ASIN Format**
- 10 characters long
- Alphanumeric (A-Z, 0-9)
- Example: B08N5WRWNW

⚠️ **Common Issues**

**"OpenAI API key is invalid"**
- Check your API key in `backend/.env`
- Ensure it starts with `sk-`
- Verify you have credits in OpenAI account

**"Database connection failed"**
- Ensure MySQL is running: `sudo systemctl status mysql`
- Check credentials in `backend/.env`
- Verify database exists: `mysql -u root -p salesduo`

**"Product not found"**
- Verify ASIN is valid on Amazon.com
- Try a different ASIN
- Amazon may be blocking scraping requests

---

## Next Steps

### Explore the API

Try the API directly:
```bash
curl -X POST http://localhost:3001/api/products/process \
  -H "Content-Type: application/json" \
  -d '{"asin":"B08N5WRWNW"}'
```

### View History

```bash
curl http://localhost:3001/api/products/history/B08N5WRWNW
```

### Check Health

```bash
curl http://localhost:3001/health
```

---

## Stopping the Application

### Manual Setup

Press `Ctrl+C` in both terminal windows

### Docker Setup

```bash
docker-compose down
```

---

## Need Help?

📖 **Full Documentation:** See [README.md](README.md)

🔧 **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

🚀 **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md)

🐛 **Issues:** [GitHub Issues](https://github.com/sksinha2410/SalesDuo/issues)

---

## What's Happening Behind the Scenes?

1. **Scraping:** The backend uses Axios and Cheerio to fetch product data from Amazon
2. **AI Processing:** OpenAI GPT-3.5 analyzes the content and generates optimizations
3. **Storage:** Results are saved to MySQL with timestamps
4. **Display:** React frontend shows the comparison in a clean UI

---

## Understanding the Results

### Optimized Title
- Includes primary keywords
- Follows Amazon's 200-character limit
- More descriptive and compelling

### Optimized Bullet Points
- Benefit-focused (not just features)
- Clear and scannable
- Proper length (under 250 chars each)
- Better structured

### Enhanced Description
- Engaging opening
- Addresses customer needs
- Complies with Amazon policies
- Includes call-to-action

### Keyword Suggestions
- Relevant search terms
- Long-tail keywords
- SEO-optimized for Amazon

---

## Best Practices

1. **Test with Different Products**
   - Electronics
   - Books
   - Home goods
   - Try various categories

2. **Compare Multiple Runs**
   - Process the same ASIN multiple times
   - Check history to see variations
   - Pick the best optimization

3. **Customize Prompts**
   - Edit `backend/src/services/aiOptimizer.js`
   - Adjust temperature for creativity
   - Modify instructions for your needs

4. **Monitor API Usage**
   - Check OpenAI dashboard regularly
   - Set up billing alerts
   - Track costs

---

## Example Workflow

```
1. Seller finds product on Amazon
   ↓
2. Copies ASIN (e.g., B08N5WRWNW)
   ↓
3. Enters ASIN in SalesDuo
   ↓
4. Clicks "Optimize"
   ↓
5. Reviews AI-generated improvements
   ↓
6. Uses optimized content to update Amazon listing
   ↓
7. Tracks performance improvements
```

---

## Keyboard Shortcuts

- **Enter** in ASIN input: Submit form
- **Ctrl+R**: Refresh page
- **Ctrl+C**: Stop server

---

## Cost Estimates

**OpenAI API Costs (GPT-3.5 Turbo):**
- ~$0.002 per optimization
- $1 = ~500 optimizations
- Very affordable for small to medium use

**Infrastructure:**
- Development: Free (local)
- Production: $5-20/month (VPS + Database)

---

## FAQ

**Q: Can I use this for multiple marketplaces?**
A: Currently supports Amazon.com. Can be extended for other marketplaces.

**Q: Is web scraping legal?**
A: Gray area. For educational purposes. Consider Amazon's API for production.

**Q: Can I customize the AI prompts?**
A: Yes! Edit `backend/src/services/aiOptimizer.js`

**Q: How do I backup my data?**
A: Regular MySQL backups. See DEPLOYMENT.md for automation.

**Q: Can I use GPT-4?**
A: Yes, change model in `aiOptimizer.js` (costs more)

---

## Performance Expectations

- **Scraping Time:** 5-10 seconds
- **AI Processing:** 10-20 seconds
- **Total Time:** 15-30 seconds per ASIN
- **Accuracy:** Depends on AI model and product data quality

---

## Congratulations!

You're now ready to optimize Amazon listings with AI! 🚀

**Happy Optimizing!** 🎯
