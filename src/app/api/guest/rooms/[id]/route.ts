import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: any }) {
    const roomCode = context.params.id;

    if (!roomCode) {
        return new Response(JSON.stringify({message: "Room Code is required"}), {status: 400})
    }

    try {
        // Find the room with the given room code
        const room = await prisma.room.findUnique({
            where: {code: roomCode},
            include: {
                guests: true, blocks: {
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
            },
        });

        if (!room) {
            return new Response(JSON.stringify({message: "Room not found"}));
        }
        return new Response(JSON.stringify(room));
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({message: "Internal server error"}));
    }
}
