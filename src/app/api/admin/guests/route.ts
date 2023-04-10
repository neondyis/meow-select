import prisma from '@/lib/prisma';

export async function DELETE(request: Request) {
    try {
        const {id} = await request.json();

        const deletedUser = await prisma.guest.delete({
            where: {id}
        })
        return new Response(JSON.stringify(deletedUser), {status: 200});
    } catch (error) {
        console.error(error);
        return new Response("An error occurred while deleting the topic block.", {
            status: 500,
        });
    }
}