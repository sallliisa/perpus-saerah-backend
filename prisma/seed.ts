import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Muslik van Mook',
            email: 'mvm@eic.com',
            password: '1234',
            type: 'officer'
        }
    })

    const officer = await prisma.officer.create({
        data: {
            user_id: user.id
        }
    })

    const category = await prisma.category.create({
        data: {
            name: 'Science Fiction'
        }
    })

    const book = await prisma.book.create({
        data: {
            name: 'Return of the Obra Dinn',
            isbn: '1234-1234-1234',
            author: 'Lucas Pope',
            publisher: 'Lucas Pope',
            publishing_city: 'Atlanta',
            editor: 'Lucas Pope',
            category_id: category.id,
            stock: 12            
        }
    })
}

main().then(async () => {
    await prisma.$disconnect()
})