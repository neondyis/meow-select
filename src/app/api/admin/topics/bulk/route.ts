import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const {topics, roomId} = await request.json();
    const result = await Promise.all(topics.map(async (topic: string) => {
        return prisma.topic_Block.create({
            data: {
                content: topic,
                isShown: false,
                roomId: roomId
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
    }))

    return new Response(JSON.stringify(result), {status: 200});
}