const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes Amazon product details from ASIN
 * Note: This is a simplified implementation. Amazon's anti-scraping measures
 * may block requests. In production, consider using:
 * - Amazon Product Advertising API (requires approval)
 * - Proxy rotation services
 * - More sophisticated scraping tools
 */
class AmazonScraper {
  constructor() {
    this.baseUrl = 'https://www.amazon.com/dp/';
    this.headers = {
      'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    };
  }

  async scrapeProduct(asin) {
    try {
      if (!asin || typeof asin !== 'string' || asin.length < 10) {
        throw new Error('Invalid ASIN format');
      }

      const url = `${this.baseUrl}${asin}`;
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 10000,
        maxContentLength: 5000000 // Limit to 5MB
      });

      const $ = cheerio.load(response.data);

      // Extract title
      const title = $('#productTitle').text().trim() || 
                   $('span#productTitle').text().trim() ||
                   '';

      // Extract bullet points
      const bulletPoints = [];
      $('#feature-bullets ul li span.a-list-item').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && !text.includes('›')) {
          bulletPoints.push(text);
        }
      });

      // Extract description
      let description = '';
      
      // Try multiple selectors for description
      const descriptionSelectors = [
        '#productDescription p',
        '#feature-bullets',
        '#aplus',
        '.a-section.a-spacing-medium'
      ];

      for (const selector of descriptionSelectors) {
        const desc = $(selector).first().text().trim();
        if (desc && desc.length > 50) {
          description = desc;
          break;
        }
      }

      // If no description found, use a combination of available text
      if (!description) {
        description = bulletPoints.join(' ');
      }

      if (!title) {
        throw new Error('Product not found or unable to extract data. The ASIN may be invalid or the page structure may have changed.');
      }

      return {
        asin,
        title,
        bulletPoints: bulletPoints.length > 0 ? bulletPoints : ['No bullet points available'],
        description: description || 'No description available'
      };

    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Product not found. Please check the ASIN.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to Amazon. Please check your internet connection.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timeout. Amazon may be blocking requests. Please try again later.');
      }
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }
}

module.exports = new AmazonScraper();
