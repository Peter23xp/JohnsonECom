const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Pages existantes
const existingPages = new Set();
// Liens trouvés dans les fichiers
const foundLinks = new Set();
// Liens externes
const externalLinks = new Set();
// Liens internes manquants
const missingLinks = new Set();

// Chercher tous les fichiers HTML dans le répertoire
function findHtmlFiles(directory) {
  const htmlFiles = [];
  
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      // Recursive search in subdirectories
      htmlFiles.push(...findHtmlFiles(filePath));
    } else if (path.extname(file).toLowerCase() === '.html') {
      htmlFiles.push(filePath);
      existingPages.add(file);
    }
  }
  
  return htmlFiles;
}

// Analyser un fichier HTML pour trouver tous les liens
function scanHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);
  
  // Chercher tous les liens
  $('a').each((index, element) => {
    const href = $(element).attr('href');
    if (!href) return;
    
    if (href.startsWith('http') || href.startsWith('https')) {
      // Lien externe
      externalLinks.add(href);
    } else if (href.endsWith('.html')) {
      // Lien interne vers une page HTML
      foundLinks.add(href);
      
      // Vérifier si la page existe
      if (!existingPages.has(href)) {
        missingLinks.add(href);
      }
    }
  });
  
  // Chercher aussi dans le JavaScript intégré
  $('script').each((index, element) => {
    const content = $(element).text();
    
    // Recherche de patterns href="*.html" dans le JavaScript
    const regex = /href=['"]([^'"]*\.html)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const href = match[1];
      foundLinks.add(href);
      
      if (!existingPages.has(href)) {
        missingLinks.add(href);
      }
    }
  });
}

// Créer une page HTML basique avec un template minimal
function createBasicHtmlPage(pageName) {
  const pageTitle = pageName.replace('.html', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} - Moses Shoes & Clothing Line</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css">
    <script src="https://cdn.tailwindcss.com/3.4.16"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1D1C1C',     // Deep Black
                        secondary: '#86997B',   // Sage Green
                        tertiary: '#E1E6C9',    // Light Green
                        neutral: '#FAFAF0',     // Soft White
                        dark: '#3B3E3A',        // Dark Gray
                    }
                }
            }
        };
    </script>
    <!-- Include navbar component -->
    <script src="components/navbar.js"></script>
    <!-- Include footer component -->
    <script src="components/footer.js"></script>
    <!-- Include global CSS -->
    <link rel="stylesheet" href="src/css/global.css">
</head>
<body class="bg-neutral">
    <!-- Header/navbar will be injected by navbar.js -->

    <!-- Main Content -->
    <main class="pt-28 pb-20">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center">${pageTitle}</h1>
            
            <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div class="text-center mb-8">
                    <div class="w-24 h-24 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-tools-line text-4xl text-secondary"></i>
                    </div>
                    <h2 class="text-2xl font-semibold mb-2">Page en construction</h2>
                    <p class="text-gray-600">Cette page est en cours de développement. Revenez bientôt pour découvrir notre contenu !</p>
                </div>
                
                <div class="flex justify-center">
                    <a href="index.html" class="bg-secondary hover:bg-opacity-90 text-neutral px-8 py-3 rounded-button font-medium text-lg transition-all">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer will be injected by footer.js -->
</body>
</html>`;

  return htmlTemplate;
}

// Programme principal
(async function main() {
  try {
    // 1. Trouver tous les fichiers HTML
    const htmlFiles = findHtmlFiles('.');
    console.log(`${htmlFiles.length} fichiers HTML trouvés.`);
    console.log(`Pages existantes: ${Array.from(existingPages).join(', ')}`);
    
    // 2. Scanner chaque fichier pour trouver les liens
    htmlFiles.forEach(file => {
      scanHtmlFile(file);
    });
    
    console.log(`\nLiens internes trouvés: ${foundLinks.size}`);
    console.log(`Liens externes trouvés: ${externalLinks.size}`);
    console.log(`Liens internes manquants: ${missingLinks.size}`);
    
    if (missingLinks.size > 0) {
      console.log('\nPages manquantes:');
      missingLinks.forEach(link => {
        console.log(` - ${link}`);
        
        // 3. Créer les pages manquantes
        const pageContent = createBasicHtmlPage(link);
        fs.writeFileSync(link, pageContent, 'utf-8');
        console.log(`   Page créée avec succès !`);
      });
    }
    
    console.log('\nRapport complet:');
    console.log('----------------');
    console.log(`Liens externes (${externalLinks.size}):`);
    externalLinks.forEach(link => console.log(` - ${link}`));
    
  } catch (error) {
    console.error('Erreur:', error);
  }
})(); 