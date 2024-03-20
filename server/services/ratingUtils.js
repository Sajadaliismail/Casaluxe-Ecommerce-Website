function calculateAverageRating(product) {
  if (product.rating && product.rating.length > 0) {
      const totalRating = product.rating.reduce((acc, curr) => acc + curr, 0);
      const averageRating = totalRating / product.rating.length;
      return averageRating.toFixed(2);
  } else {
      return 'No ratings yet';
  }
}

module.exports = calculateAverageRating;