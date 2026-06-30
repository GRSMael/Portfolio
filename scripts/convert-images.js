#!/usr/bin/env node
/**
 * convert-images.js — Génération des assets images pour grosamael.fr
 * Génère : og-image.jpg, icon-192.png, icon-512.png, et les .webp depuis les PNG
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

async function main() {
    // 1. Convertir les PNG en WebP
    const pngs = ['demo-restaurant.png', 'demo-coiffure.png', 'demo-coach.png'];
    for (const png of pngs) {
        const input = path.join(IMAGES_DIR, png);
        const output = path.join(IMAGES_DIR, png.replace('.png', '.webp'));
        if (!fs.existsSync(input)) { console.warn(`Skipping ${png} (not found)`); continue; }
        await sharp(input).webp({ quality: 85 }).toFile(output);
        console.log(`✓ ${png} → ${png.replace('.png', '.webp')}`);
        // AVIF generation
        const avifOutput = path.join(IMAGES_DIR, png.replace('.png', '.avif'));
        await sharp(input).avif({ quality: 70 }).toFile(avifOutput);
        console.log(`✓ ${png} → ${png.replace('.png', '.avif')}`);
    }

    // 2. Générer l'icône PWA (192x192 et 512x512) — carré indigo arrondi avec "MG"
    for (const size of [192, 512]) {
        const fontSize = Math.round(size * 0.35);
        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect rx="${size * 0.2}" width="${size}" height="${size}" fill="#4f46e5"/>
  <text x="${size/2}" y="${size * 0.65}" font-size="${fontSize}" font-family="system-ui, -apple-system, sans-serif"
    font-weight="bold" fill="white" text-anchor="middle">${'MG'}</text>
</svg>`;
        const output = path.join(IMAGES_DIR, `icon-${size}.png`);
        await sharp(Buffer.from(svg)).png().toFile(output);
        console.log(`✓ icon-${size}.png`);
    }

    // 3. Générer l'OG image (1200x630) — gradient indigo avec texte
    const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="rgba(255,255,255,0.06)"/>
  <text x="600" y="220" font-size="48" font-family="system-ui, -apple-system, sans-serif"
    font-weight="bold" fill="rgba(255,255,255,0.6)" text-anchor="middle" letter-spacing="4">CONCEPTEUR WEB FREELANCE</text>
  <text x="600" y="350" font-size="110" font-family="system-ui, -apple-system, sans-serif"
    font-weight="900" fill="white" text-anchor="middle" letter-spacing="-2">Maël Grosa</text>
  <text x="600" y="450" font-size="42" font-family="system-ui, -apple-system, sans-serif"
    fill="rgba(199,210,254,0.9)" text-anchor="middle">Marseille · Sites web sur-mesure · Devis gratuit</text>
  <text x="600" y="545" font-size="30" font-family="system-ui, -apple-system, sans-serif"
    fill="rgba(255,255,255,0.5)" text-anchor="middle">grosamael.fr</text>
</svg>`;
    const ogOutput = path.join(IMAGES_DIR, 'og-image.jpg');
    await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90 }).toFile(ogOutput);
    console.log('✓ og-image.jpg (1200x630)');

    console.log('\n✅ Toutes les images générées avec succès.');
}

main().catch(err => { console.error('❌ Erreur:', err); process.exit(1); });
