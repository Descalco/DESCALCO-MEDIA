const fs = require('fs-extra');
const path = require('path');

// Migration script to import existing hardcoded projects into the backoffice system
const existingProjects = [
    {
        id: 'sof-week',
        title: 'SOF WEEK: Motion Design for Military Events',
        year: 2025,
        category: 'Motion Design',
        projectType: 'case-study',
        description: 'Final degree project aiming to modernize the visual identity of SOF Week, an event promoted by the Special Operations Forces Center, through strategic branding and motion design.',
        tags: ['Motion Design', 'Branding', 'Military Event', 'Final Project'],
        externalLink: null,
        featured: true,
        status: 'published',
        source: 'hardcoded',
        htmlFile: 'projects/sof-week.html',
        coverMedia: 'assets/img/OUTROS/SOF-WEEK.mp4',
        createdAt: new Date('2025-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'guisado',
        title: 'GUISADO - 3D SHORT MOVIE',
        year: 2025,
        category: '3D Animation',
        projectType: 'case-study',
        description: '"GUISADO" is a 4-minute 3D animated short film exploring themes of loneliness, superficial relationships, and the illusion of happiness. Created as part of the Animation III curriculum at ESMAD, this atmospheric piece combines motion capture performance with stylized 3D animation to tell a surreal gothic tale.',
        tags: ['3D Animation', 'Character Animation', 'Motion Capture'],
        externalLink: null,
        featured: true,
        status: 'published',
        source: 'hardcoded',
        htmlFile: 'projects/guisado.html',
        coverMedia: 'assets/img/OUTROS/GUISADO-VIDEO.mp4#t=3',
        createdAt: new Date('2025-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'cidade-do-futuro',
        title: 'AMBIVALÊNCIA - CITY OF THE FUTURE',
        year: 2023,
        category: '2D Animation',
        projectType: 'case-study',
        description: '"Ambivalência" is an animation/installation created for large-scale projection at the Alfândega Congress Center in Porto. Developed as part of the "Multimedia I" course at ESMAD in collaboration with OCUBO, this visually striking project explores the contrast between utopian dreams and dystopian reality through a young girl\'s journey.',
        tags: ['2D Animation', 'Character Animation', 'Video Mapping'],
        externalLink: null,
        featured: true,
        status: 'published',
        source: 'hardcoded',
        htmlFile: 'projects/cidade-do-futuro.html',
        coverMedia: 'assets/img/OUTROS/pa_-_immersivus_x_a_cidade_do_futuro (1080p) (online-video-cutter.com).mp4',
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'motion-jam-winner',
        title: '"A Carne que Anda" — Winner of MOTION JAM 2025',
        year: 2025,
        category: 'Motion Design',
        projectType: 'simple',
        description: 'Challenged to create an animation under the themes The Admirable Grotesque, Elevator, and Flash, we won 1st place at MOTION JAM 2025 with our project \'A Carne que Anda\' (The Flesh That Walks), as voted by renowned Portuguese motion design jurors. Developed in 48 hours as team NOUSHOE (with Nuno Faria), the animation blends frame-by-frame techniques, 2.5D animation in After Effects, and a narrative voice-over',
        tags: ['Award Winning', 'Motion Design', '48H CHALLENGE'],
        externalLink: 'https://youtu.be/P0jaOjuQ654',
        featured: true,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/Noushoe.mp4',
        createdAt: new Date('2025-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'limifield-corporate',
        title: 'Limifield - Corporate Video',
        year: 2024,
        category: 'Video Production',
        projectType: 'simple',
        description: 'Corporate video created for Limifield.LDA, a company specializing in the import and distribution of IT equipment since 2007. The project highlights the company\'s exclusive brands and extensive product portfolio, conveying professionalism and trust. Featuring dynamic motion design, the video strengthens the brand\'s visual identity and market presence in the tech industry.',
        tags: ['Corporate Video', 'Motion Design', 'Business Communication'],
        externalLink: 'https://www.youtube.com/watch?v=ug4wro36A-o&t=2s',
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/LIMIFIELD-INSTITUCIONAL.mp4',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'limifield-type-ad',
        title: 'Type in Motion: Corporate Ad for Limifield',
        year: 2023,
        category: 'Motion Design',
        projectType: 'simple',
        description: 'Full kinetic typography ad created for Limifield.LDA to attract new business partners. The project blends animated type, voice-over, and minimalist motion design to deliver a clear and compelling message about partnership opportunities with the brand.',
        tags: ['Kinetic Type', 'Business Communication', 'Motion Design'],
        externalLink: 'https://www.youtube.com/watch?v=jBuUN4bA3YI',
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/limifield-type-ad.mp4',
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'let-it-happen',
        title: 'LET IT HAPPEN - EXPERIMENTAL ANIMATION',
        year: 2022,
        category: '2D Animation',
        projectType: 'case-study',
        description: 'This experimental short film explores themes of anxiety, transformation, and acceptance — visually inspired by the song "Let It Happen" by Tame Impala. Structured in three emotional phases (Stress, Flow, and Overcoming), the film animates the inner struggles of someone learning to let go and embrace change.',
        tags: ['Frame by frame', 'Motion Design', 'Animation'],
        externalLink: null,
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: 'projects/let-it-happen.html',
        coverMedia: 'assets/img/OUTROS/LETITHAPPEN.mp4',
        createdAt: new Date('2022-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'queen-animation',
        title: 'Experimental Animation – QUEEN',
        year: 2022,
        category: '2D Animation',
        projectType: 'simple',
        description: 'METAMORPHOSIS is a hand-drawn frame-by-frame animation exploring transformation and identity. Created using traditional animation techniques with modern digital tools, this piece delves into the concept of personal evolution and the fluid nature of self-perception through abstract visual storytelling.',
        tags: ['Animation', 'Frame-By-Frame', 'Adobe Animate'],
        externalLink: 'https://youtu.be/xAjgsekjEcI',
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/queen.mp4',
        createdAt: new Date('2022-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'kinetic-duality',
        title: 'KINETIC DUALITY: Interactive Art Installation',
        year: 2022,
        category: 'Motion Design',
        projectType: 'simple',
        description: 'KINETIC DUALITY is an interactive art installation exploring the stark contrast between life and death through projected posters, a central mirror, and Kinect sensors. Viewers trigger opposing animations and sounds. Developed with TouchDesigner, Madmapper, and After Effects.',
        tags: ['Motion Design', 'Kinectic Type', 'Installation'],
        externalLink: 'https://www.youtube.com/watch?v=o8OGEqCWxZ8',
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/KINETIC DUALITY.mp4',
        createdAt: new Date('2022-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'desistir-book',
        title: 'DESISTIR - CONCEPTUAL BOOK',
        year: 2024,
        category: 'Graphic Design',
        projectType: 'case-study',
        description: '"DESISTIR" is a book that explores a teenager\'s entry into university life. Despite initially being motivated, João quickly realizes the challenge and difficulties of the path he has chosen.',
        tags: ['Design', 'Graphic Design', 'Book'],
        externalLink: null,
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: 'projects/desistir.html',
        coverMedia: 'assets/img/DESISTIR/DESISTIR-CAPA2.jpg',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'empresta-verbo-amar',
        title: 'Empresta o Verbo Amar',
        year: 2022,
        category: 'Video Production',
        projectType: 'simple',
        description: 'Music video for musician Luis Sequeira produced as a student exercise for college at Escola Superior de Media Artes E Design.',
        tags: ['VideoClip', 'Producing', 'Storytelling'],
        externalLink: 'https://www.youtube.com/watch?v=BgKK0P0Rjyo',
        featured: false,
        status: 'published',
        source: 'hardcoded',
        htmlFile: null,
        coverMedia: 'assets/img/OUTROS/EmprestaOVerboAmar.mp4',
        createdAt: new Date('2022-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    }
];

async function migrateExistingProjects() {
    try {
        console.log('🔄 Starting migration of existing projects...');
        
        // Ensure data directory exists
        await fs.ensureDir(path.join(__dirname, 'data'));
        
        // Read current projects.json or create empty array
        const projectsPath = path.join(__dirname, 'data', 'projects.json');
        let currentData = { projects: [] };
        
        if (await fs.pathExists(projectsPath)) {
            const data = await fs.readFile(projectsPath, 'utf8');
            currentData = JSON.parse(data);
        }
        
        // Add existing projects with hardcoded flag
        const migratedProjects = [...(currentData.projects || [])];
        let addedCount = 0;
        
        for (const project of existingProjects) {
            // Check if project already exists
            const exists = migratedProjects.find(p => p.id === project.id);
            if (!exists) {
                migratedProjects.push(project);
                addedCount++;
                console.log(`✅ Added: ${project.title}`);
            } else {
                console.log(`⚠️  Skipped (already exists): ${project.title}`);
            }
        }
        
        // Save updated projects
        const updatedData = { projects: migratedProjects };
        await fs.writeFile(projectsPath, JSON.stringify(updatedData, null, 2));
        
        console.log(`\n🎉 Migration complete!`);
        console.log(`📊 Added ${addedCount} new projects`);
        console.log(`📊 Total projects: ${migratedProjects.length}`);
        console.log(`\n💡 Hardcoded projects are marked with source: "hardcoded"`);
        console.log(`💡 They will show "(hardcoded)" tag in the dashboard`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateExistingProjects();
}

module.exports = { migrateExistingProjects, existingProjects };
