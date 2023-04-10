import prisma from '@/lib/prisma';

export async function POST(request: Request){
    const { arg } = await request.json();
    const { username, password } = arg
    const admin = await prisma.admin.findUnique({
        where: {
            username: username,
        },
    });

    if (admin && admin.password === password) {
        return new Response(JSON.stringify({id: admin.id, name:admin.username}),{status: 200});
    } else {
        return new Response(JSON.stringify({message:"Failed to login, wrong username or password."}),{status: 400});
    }
}
