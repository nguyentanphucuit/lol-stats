const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if rune_builds table exists and has data
    try {
      const runeBuilds = await prisma.runeBuild.findMany();
      console.log(`✅ rune_builds table found with ${runeBuilds.length} records`);
      
      if (runeBuilds.length > 0) {
        console.log('Sample record:', runeBuilds[0]);
      }
    } catch (error) {
      console.log('❌ Error accessing rune_builds table:', error.message);
    }
    
    // Check champions table as reference
    try {
      const champions = await prisma.champion.findMany();
      console.log(`✅ champions table found with ${champions.length} records`);
    } catch (error) {
      console.log('❌ Error accessing champions table:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 