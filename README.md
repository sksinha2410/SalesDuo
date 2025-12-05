# SalesDuo - Amazon Listing Optimizer

An AI-powered web application that helps optimize Amazon product listings by fetching product details from Amazon and using artificial intelligence to generate improved titles, bullet points, descriptions, and keyword suggestions.

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React
- **Database**: MySQL
- **AI**: OpenAI GPT-3.5 Turbo
- **Web Scraping**: Axios & Cheerio

## Features

1. **Automated Product Data Fetching**: Enter an ASIN and automatically scrape product details from Amazon
2. **AI-Powered Optimization**: Generate improved, SEO-friendly content using advanced AI
3. **Side-by-Side Comparison**: View original and optimized listings in an intuitive layout
4. **Historical Tracking**: Store and view all past optimizations for each ASIN
5. **Keyword Suggestions**: Get 3-5 relevant keywords for better Amazon SEO
6. **Responsive Design**: Works seamlessly on desktop and mobile devices
7. **Error Handling**: Graceful error handling with user-friendly messages

## Prerequisites

### Option 1: Docker (Recommended)
- Docker and Docker Compose
- OpenAI API Key

### Option 2: Manual Setup
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- OpenAI API Key

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sksinha2410/SalesDuo.git
cd SalesDuo
```

### 2. Choose Your Setup Method

#### Option A: Quick Setup with Docker (Recommended)

1. Create a `.env` file in the root directory:

```bash
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

2. Start all services with Docker Compose:

```bash
docker-compose up -d
```

That's it! The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3306

To stop the services:

```bash
docker-compose down
```

#### Option B: Manual Setup

##### 1. Database Setup

Create a MySQL database and run the schema:

```bash
mysql -u root -p < backend/db/schema.sql
```

Or manually create the database:

```sql
CREATE DATABASE IF NOT EXISTS salesduo;
USE salesduo;

CREATE TABLE IF NOT EXISTS product_optimizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL,
    original_title TEXT,
    original_bullet_points JSON,
    original_description TEXT,
    optimized_title TEXT,
    optimized_bullet_points JSON,
    optimized_description TEXT,
    suggested_keywords JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_asin (asin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

##### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=salesduo
OPENAI_API_KEY=your_openai_api_key_here
```

##### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit if needed (default should work):

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Running the Application (Manual Setup)

### Start the Backend

```bash
cd backend
npm start
```

The backend API will run on http://localhost:3001

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter an Amazon ASIN (e.g., B08N5WRWNW) in the input field
3. Click "Optimize" to process the listing
4. View the side-by-side comparison of original and optimized content
5. Check the history section to see past optimizations for the same ASIN

## API Endpoints

### Process ASIN
- **POST** `/api/products/process`
- Body: `{ "asin": "B08N5WRWNW" }`
- Returns: Original and optimized product data

### Get History
- **GET** `/api/products/history/:asin`
- Returns: All past optimizations for the specified ASIN

### Get All Optimizations
- **GET** `/api/products/optimizations?limit=50&offset=0`
- Returns: Paginated list of all optimizations

### Get Optimization by ID
- **GET** `/api/products/optimization/:id`
- Returns: Detailed data for a specific optimization

## AI Prompt Engineering Approach

The AI optimization uses carefully crafted prompts to ensure high-quality outputs:

### 1. Title Optimization
- **Goal**: Create keyword-rich, readable titles under 200 characters
- **Approach**: Instruct the AI to focus on primary keywords while maintaining natural language
- **Constraints**: Follow Amazon's title guidelines, avoid promotional language and ALL CAPS

### 2. Bullet Points Optimization
- **Goal**: Clear, scannable benefits-focused points
- **Approach**: Emphasize value propositions and product benefits over basic features
- **Constraints**: Each point under 250 characters, proper grammar, no unsubstantiated claims

### 3. Description Enhancement
- **Goal**: Persuasive, compliant 200-300 word descriptions
- **Approach**: Create engaging content that addresses customer concerns and includes calls to action
- **Constraints**: Avoid medical claims, unsubstantiated superlatives, and maintain Amazon policy compliance

### 4. Keyword Generation
- **Goal**: 3-5 relevant SEO keywords
- **Approach**: Generate terms customers would actually search for, including long-tail keywords
- **Focus**: Amazon search optimization and discoverability

All prompts include:
- Clear instructions and constraints
- Context about Amazon's content requirements
- Emphasis on compliance with Amazon's policies
- Structured output format (JSON) for reliable parsing

## Important Notes

### Web Scraping Considerations

This application uses web scraping to fetch Amazon product data. Please note:

1. **Amazon's Terms of Service**: Web scraping may violate Amazon's TOS. This is a proof-of-concept for educational purposes.
2. **Anti-Scraping Measures**: Amazon employs various anti-scraping techniques (CAPTCHAs, rate limiting, IP blocking) that may prevent data fetching.
3. **Production Alternatives**:
   - Use Amazon's Product Advertising API (requires approval)
   - Implement proxy rotation services
   - Use commercial scraping APIs
   - Consider manual data entry

### Rate Limiting

To avoid being blocked:
- Don't make too many requests in a short time
- Consider implementing request delays
- Use rotating proxies in production

### OpenAI API Costs

The application uses OpenAI's GPT-3.5 Turbo model. Each optimization request incurs a small cost based on token usage. Monitor your OpenAI usage dashboard to track costs.

## Security Considerations

1. Never commit `.env` files with real credentials
2. Use environment variables for all sensitive data
3. Implement rate limiting in production
4. Add authentication/authorization for production use
5. Sanitize all user inputs
6. Use HTTPS in production

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check that the database and table exist

### Scraping Failures
- Amazon may be blocking requests
- Try changing the User-Agent in `.env`
- Consider using a proxy service
- Verify the ASIN is valid

### OpenAI API Errors
- Check that your API key is valid
- Ensure you have sufficient credits
- Verify your OpenAI account status

## Future Enhancements

- Implement user authentication
- Add batch processing for multiple ASINs
- Include A/B testing suggestions
- Add export functionality (PDF/CSV)
- Implement competitor analysis
- Add image optimization suggestions
- Support for multiple Amazon marketplaces
- Advanced analytics and reporting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please open an issue on GitHub.