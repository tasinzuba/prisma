import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 3000;

async function main() {
try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");


app.listen(PORT, () => {
    console.log(`Bhai Ami Kaj Kortechi ${PORT}`);
});

} catch (error) {
    console.error("Error connecting to the database:", error);
await prisma.$disconnect();
process.exit(1);
}
}
main();
