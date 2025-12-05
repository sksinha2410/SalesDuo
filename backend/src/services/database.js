const pool = require('../config/database');

class DatabaseService {
  /**
   * Save product optimization to database
   */
  async saveOptimization(data) {
    const {
      asin,
      originalTitle,
      originalBulletPoints,
      originalDescription,
      optimizedTitle,
      optimizedBulletPoints,
      optimizedDescription,
      suggestedKeywords
    } = data;

    const query = `
      INSERT INTO product_optimizations 
      (asin, original_title, original_bullet_points, original_description, 
       optimized_title, optimized_bullet_points, optimized_description, suggested_keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        asin,
        originalTitle,
        JSON.stringify(originalBulletPoints),
        originalDescription,
        optimizedTitle,
        JSON.stringify(optimizedBulletPoints),
        optimizedDescription,
        JSON.stringify(suggestedKeywords)
      ]);

      return result.insertId;
    } catch (error) {
      console.error('Database save error:', error);
      throw new Error('Failed to save optimization to database');
    }
  }

  /**
   * Get optimization history for a specific ASIN
   */
  async getHistoryByAsin(asin) {
    const query = `
      SELECT 
        id,
        asin,
        original_title,
        original_bullet_points,
        original_description,
        optimized_title,
        optimized_bullet_points,
        optimized_description,
        suggested_keywords,
        created_at
      FROM product_optimizations
      WHERE asin = ?
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [asin]);
      
      // Parse JSON fields
      return rows.map(row => ({
        ...row,
        original_bullet_points: JSON.parse(row.original_bullet_points || '[]'),
        optimized_bullet_points: JSON.parse(row.optimized_bullet_points || '[]'),
        suggested_keywords: JSON.parse(row.suggested_keywords || '[]')
      }));
    } catch (error) {
      console.error('Database fetch error:', error);
      throw new Error('Failed to fetch optimization history');
    }
  }

  /**
   * Get all optimizations (with pagination)
   */
  async getAllOptimizations(limit = 50, offset = 0) {
    const query = `
      SELECT 
        id,
        asin,
        original_title,
        optimized_title,
        created_at
      FROM product_optimizations
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Database fetch error:', error);
      throw new Error('Failed to fetch optimizations');
    }
  }

  /**
   * Get a specific optimization by ID
   */
  async getOptimizationById(id) {
    const query = `
      SELECT 
        id,
        asin,
        original_title,
        original_bullet_points,
        original_description,
        optimized_title,
        optimized_bullet_points,
        optimized_description,
        suggested_keywords,
        created_at
      FROM product_optimizations
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        ...row,
        original_bullet_points: JSON.parse(row.original_bullet_points || '[]'),
        optimized_bullet_points: JSON.parse(row.optimized_bullet_points || '[]'),
        suggested_keywords: JSON.parse(row.suggested_keywords || '[]')
      };
    } catch (error) {
      console.error('Database fetch error:', error);
      throw new Error('Failed to fetch optimization');
    }
  }
}

module.exports = new DatabaseService();
