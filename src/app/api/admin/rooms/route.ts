import prisma from '../../../../lib/prisma'

export async function POST(request: Request) {
    const {size} = await request.json();
    const result = await prisma.room.create({
        data: {
            size: size
        }
    })
    return new Response(JSON.stringify(result), {status: 200})
}

export async function PUT(request: Request) {
    try {
        const {id,size} = await request.json();
        const updatedBlock = await prisma.room.update({
            where: {id},
            data: {size},
            include: {
                guests: true,
                blocks: {
                    include: {
                        guest: {
                            select: {
                                id: true,
                                name: true,
                                password: false
                            }
                        }
                    }
                }
            }
        });

        return new Response(JSON.stringify(updatedBlock), {status: 200});
    } catch (error) {
        console.error(error);
        return new Response("An error occurred while updating the topic block.", {
            status: 500,
        });
    }
}

export async function GET(request: Request) {
    const result = await prisma.room.findMany({
        include: {
            guests: true,
            blocks: {
                include: {
                    guest: {
                        select: {
                            id: true,
                            name: true,
                            password: false
                        }
                    }
                }
            }
        }
    });
    return new Response(JSON.stringify(result), {status: 200})
}

