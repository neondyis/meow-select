import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
    const {content,roomId} = await request.json();

    const newBlock = await prisma.topic_Block.create({
        data: {
            content,
            roomId
        },
        include: {
            guest: {
                select: {
                    id: true,
                    name: true,
                    password: false,
                }
            }
        }
    });
    return new Response(JSON.stringify(newBlock), {status: 200});
} catch (error) {
    console.error(error);
    return new Response("An error occurred while adding the topic block.", {
        status: 500,
    });
}
}

export async function PUT(request: Request) {
    try {
    const {id,content,guestId,roomId} = await request.json();
    const updatedBlock = await prisma.topic_Block.update({
        where: {id},
        data: {content,guestId,roomId},
        include: {
            guest: {
                select: {
                    id: true,
                    name: true,
                    password: false,
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

export async function DELETE(request: Request) {
    try {
    const {id} = await request.json();

    const deletedBlock = await prisma.topic_Block.delete({
        where: {id}
    })

    return new Response(JSON.stringify(deletedBlock), {status: 200});
    } catch (error) {
        console.error(error);
        return new Response("An error occurred while deleting the topic block.", {
            status: 500,
        });
    }
}