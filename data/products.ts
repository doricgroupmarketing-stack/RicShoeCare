import { Product } from '../types';

const optimizeImage = (url: string) => `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3e%3crect fill='%23f3f4f6' width='600' height='600'/%3e%3ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='24'%3eProduct Image%3c/text%3e%3c/svg%3e`;

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Ric Shoe Polish',
    price: 18.00,
    description: `Restore and protect your leather footwear with our high-quality shoe polish. Enriched with a blend of natural waxes, RIC Shoe Polish is designed to deliver a long-lasting shine and preserve leather integrity!

RIC Shoe Polish is available in four (4) classic colors to suit your specific tastes:
• Black
• Dark Tan
• Mid Brown
• Toney Red

We also offer RIC Shoe Polish in three (3) sizes to suit each and every consumer:
• Small (15ml / 12gms)
• Medium (40ml / 32gms)
• Large (100ml / 80gms)`,
    image: optimizeImage(''),
    category: 'Polish',
    rating: 4.9,
    reviews: 128,
    features: [
      'Contains natural carnauba wax',
      'Water-resistant protection',
      'Restores color depth',
      'Available in 4 Classic Colors'
    ]
  },
  {
    id: 'prod-7',
    name: 'Luxury Shoe Cream',
    price: 24.00,
    description: `Nourish and revitalize your leather shoes and articles with our rich shoe cream. It is formulated to soften and deliver a long–lasting shine.

RIC Shoe Cream is available in five (5) vibrant shades to match your footwear perfectly:
• Black
• Tan
• Dark Tan
• Neutral
• Calf white

We offer RIC Shoe Creams in two (2) convenient sizes to suit each and every consumer:
• Small (50ml)
• Large (100ml)`,
    image: optimizeImage(''),
    category: 'Cream',
    rating: 4.8,
    reviews: 95,
    features: [
      'High pigment concentration',
      'Softens leather',
      'Long-lasting shine',
      'Available in 5 Vibrant Shades'
    ]
  },
  {
    id: 'prod-8',
    name: 'Suede Renovator Spray',
    price: 20.00,
    description: `Gently clean, nourish and revitalize your suede items with our restorative RIC Suede Cleaner. It is specially formulated to refresh and restore their natural color for a renewed appearance.

RIC Suede Cleaner is available in six (6) dynamic colors, ensuring all your suede items are well catered to:
• Black
• Brown
• Dark Brown
• Neutral
• Kashmire

We offer RIC Suede Cleaner in two (2) sizes to suit your needs:
• Standard (200ml)
• Large (400ml)`,
    image: optimizeImage(''),
    category: 'Suede',
    rating: 4.7,
    reviews: 156,
    features: [
      'Restores color',
      'Conditions suede',
      'Includes waterproofing agents',
      'Available in 6 Dynamic Colors'
    ]
  },
  {
    id: 'prod-9',
    name: 'Professional Leather Dye',
    price: 28.00,
    description: `Achieve deep and uniform color restoration or a bold new look with our penetrating leather dye.

RIC Leather Dye is available in (2) essential colors for versatile applications:
• Black
• Brown

We offer RIC Leather Dye in three (3) sizes to suit your specific needs:
• Small (15ml)
• Medium (40ml)
• Large (100ml)`,
    image: optimizeImage(''),
    category: 'Dye',
    rating: 4.6,
    reviews: 42,
    features: [
      'Penetrating formula',
      'Permanent color',
      'Deep color restoration',
      'Available in 2 Essential Colors'
    ]
  },
  {
    id: 'prod-10',
    name: 'Liquid Shoe Polish',
    price: 15.00,
    description: 'Quick and easy shine with our premium Liquid Shoe Polish. Perfect for on-the-go touch-ups and daily maintenance.',
    image: optimizeImage(''), // Please upload your attached image via the admin panel
    category: 'Liquid',
    rating: 4.8,
    reviews: 112,
    features: [
      'Instant shine',
      'Easy applicator sponge',
      'Nourishes leather',
      'No buffing required'
    ]
  }
];