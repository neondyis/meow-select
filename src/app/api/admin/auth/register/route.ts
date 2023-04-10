import prisma from '@/lib/prisma';


export async function POST(request: Request){
    const { username , password } = await request.json();

    const admin = await prisma.admin.create({
        data: {
            username: username,
            password: password,
        },
    });

    if (admin) {
        return new Response(JSON.stringify({id: admin.id, name:admin.username}),{status: 200});
    } else {
        return new Response("An error occurred while creating the admin user.", {
            status: 500,
        });
    }
}