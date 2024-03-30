/**
 * Calculates the average rating for a product.
 * @param {Object} product - The product object containing ratings.
 * @returns {string|number} - The average rating or a message indicating no ratings.
 */
function calculateAverageRating(product) {
  // Check if the product has ratings and the ratings array is not empty
  if (product.rating && product.rating.length > 0) {
    // Calculate the total sum of ratings
    const totalRating = product.rating.reduce((acc, curr) => acc + curr, 0);
    
    // Calculate the average rating
    const averageRating = totalRating / product.rating.length;
    
    // Return the average rating rounded to 2 decimal places
    return averageRating.toFixed(2);
  } else {
    // If there are no ratings, return a message indicating so
    return 'No ratings yet';
  }
}

module.exports = calculateAverageRating;
