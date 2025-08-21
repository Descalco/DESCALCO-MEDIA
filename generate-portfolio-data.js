const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

// Path to the projects data file
const projectsDataPath = path.join(__dirname, 'backoffice', 'data', 'projects.json');
// Path to the output file
const outputFilePath = path.join(__dirname, 'assets', 'js', 'portfolio-data.js');

// Function to generate the portfolio data file
const generatePortfolioData = () => {
    try {
        // Read the projects data
        const data = fs.readFileSync(projectsDataPath, 'utf8');
        const projectsData = JSON.parse(data);
        let projects = projectsData.projects || [];

        console.log(`📊 Found ${projects.length} total projects`);

        // Filter out hidden projects (only show visible ones)
        const visibleProjects = projects.filter(project => {
            // If visible property doesn't exist, default to true (show project)
            return project.visible !== false;
        });

        console.log(`👁️  ${visibleProjects.length} visible projects (${projects.length - visibleProjects.length} hidden)`);

        // Sort projects by display order (if exists), then by featured status, then by year
        const sortedProjects = visibleProjects.sort((a, b) => {
            // First, sort by display order if both have it
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
                return a.displayOrder - b.displayOrder;
            }
            
            // If only one has display order, prioritize it
            if (a.displayOrder !== undefined) return -1;
            if (b.displayOrder !== undefined) return 1;
            
            // Then by featured status
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Finally by year (newest first)
            return (b.year || 0) - (a.year || 0);
        });

        console.log(`🔄 Projects sorted by: display order → featured status → year`);

        // Ensure assets directory exists
        const assetsDir = path.join(__dirname, 'assets', 'img', 'OUTROS');
        fse.ensureDirSync(assetsDir);

        // Transform projects for portfolio format and copy media files
        const portfolioProjects = sortedProjects.map(project => {
            let coverMedia = null;
            let mediaType = 'image';

            if (project.coverMedia) {
                if (typeof project.coverMedia === 'string') {
                    // Handle string format (legacy)
                    if (project.coverMedia.startsWith('/uploads/')) {
                        const fileName = project.coverMedia.split('/').pop();
                        const sourcePath = path.join(__dirname, 'backoffice', project.coverMedia);
                        const destPath = path.join(assetsDir, fileName);
                        
                        // Copy file if it exists and destination doesn't exist or is older
                        if (fs.existsSync(sourcePath)) {
                            try {
                                fse.copySync(sourcePath, destPath);
                                console.log(`📁 Copied: ${fileName}`);
                            } catch (error) {
                                console.warn(`⚠️  Failed to copy ${fileName}:`, error.message);
                            }
                        }
                        
                        coverMedia = `assets/img/OUTROS/${fileName}`;
                        mediaType = fileName.endsWith('.mp4') ? 'video' : 'image';
                    } else {
                        coverMedia = project.coverMedia;
                        mediaType = coverMedia.endsWith('.mp4') ? 'video' : 'image';
                    }
                } else if (typeof project.coverMedia === 'object') {
                    // Handle object format (new uploads)
                    if (project.coverMedia.path && project.coverMedia.path.startsWith('/uploads/')) {
                        const fileName = project.coverMedia.path.split('/').pop();
                        const sourcePath = path.join(__dirname, 'backoffice', project.coverMedia.path);
                        const destPath = path.join(assetsDir, fileName);
                        
                        // Copy file if it exists
                        if (fs.existsSync(sourcePath)) {
                            try {
                                fse.copySync(sourcePath, destPath);
                                console.log(`📁 Copied: ${fileName}`);
                            } catch (error) {
                                console.warn(`⚠️  Failed to copy ${fileName}:`, error.message);
                            }
                        } else {
                            console.warn(`⚠️  Source file not found: ${sourcePath}`);
                        }
                        
                        coverMedia = `assets/img/OUTROS/${fileName}`;
                    } else {
                        coverMedia = project.coverMedia.path;
                    }
                    mediaType = project.coverMedia.type || 'image';
                }
            }

            return {
                id: project.id,
                title: project.title,
                year: project.year,
                category: project.category,
                description: project.description,
                tags: project.tags || [],
                projectType: project.projectType,
                externalLink: project.externalLink,
                featured: project.featured || false,
                coverMedia,
                mediaType,
                isStatic: false,
                displayOrder: project.displayOrder,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            };
        });

        // Create the content for the output file
        const outputContent = `// Auto-generated portfolio data from backoffice
// Generated on: ${new Date().toISOString()}
// Total projects: ${portfolioProjects.length} visible (${projects.length - visibleProjects.length} hidden)

const PORTFOLIO_PROJECTS = ${JSON.stringify(portfolioProjects, null, 2)};

export default PORTFOLIO_PROJECTS;`;

        // Ensure the output directory exists
        const outputDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the output file
        fs.writeFileSync(outputFilePath, outputContent);
        
        console.log('✅ Portfolio data generated successfully!');
        console.log(`📁 Output: ${outputFilePath}`);
        console.log(`📊 Exported ${portfolioProjects.length} projects`);
        
        // Show project order for verification
        console.log('\n📋 Project Order:');
        portfolioProjects.forEach((project, index) => {
            const orderInfo = project.displayOrder !== undefined ? `#${project.displayOrder}` : 'auto';
            const featuredInfo = project.featured ? '⭐' : '  ';
            console.log(`  ${index + 1}. ${featuredInfo} ${project.title} (${project.year}) [${orderInfo}]`);
        });

    } catch (error) {
        console.error('❌ Error generating portfolio data:', error);
        process.exit(1);
    }
};

// Run the function
generatePortfolioData();
