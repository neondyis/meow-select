import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const { name, roomCode, password } = await req.json();

    if (!name || !roomCode || !password) {
        return new Response(JSON.stringify({ message: "Name, room code, and password are required" }),{status: 400})
    }

    try {
        // Find the room with the given room code
        const room = await prisma.room.findUnique({ where: { code: roomCode } });

        if (!room) {
            return new Response(JSON.stringify({ message: "Room not found" }),{status: 404})
        }

        // Check if the guest name already exists in the room
        const guest = await prisma.guest.findFirst({
            where: {
                name: name,
                roomId: room.code,
            },
        });

        if (guest) {
            // Check if the password is correct
            const isPasswordCorrect = await bcrypt.compare(password, guest.password);
            if (!isPasswordCorrect) {
                return new Response(JSON.stringify({ message: 'Incorrect password and user already exists in the room' }),{status: 400})
            }else{
                return new Response(JSON.stringify({name:guest.name, roomId: guest.roomId}),{status: 200})
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);

            // Add the guest to the room
            const newGuest = await prisma.guest.create({
                data: {
                    name: name,
                    roomId: room.code,
                    password: hashedPassword,
                },
                select: {
                    name: true,
                    roomId: true,
                    password: false
                }
            });
            return new Response(JSON.stringify(newGuest),{status: 200})
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal server error" }),{status: 500})
    }
}


