import {
  Inter,
  Roboto,
  Poppins,
  Open_Sans,
  Playfair_Display,
} from 'next/font/google';

// Основной шрифт для текста
export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

// Альтернативный современный шрифт
export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

// Красивый шрифт для заголовков
export const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-playfair',
});

// Шрифт для кинематографического feel
export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});
