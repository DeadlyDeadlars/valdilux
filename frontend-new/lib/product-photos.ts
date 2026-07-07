export function getMainProductPhoto(productName: string, productImages: string[]): string {
  if (productImages && productImages.length > 0) return productImages[0];
  return '/photos/stol1.jpg';
}

export function getAllProductPhotos(productName: string, productImages: string[]): string[] {
  if (productImages && productImages.length > 0) return productImages;
  return ['/photos/stol1.jpg'];
}

export function getProductPhotos(productName: string, productImages: string[]): string[] {
  return getAllProductPhotos(productName, productImages);
}
