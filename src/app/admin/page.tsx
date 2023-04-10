'use client';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Button,
    Card,
    CardBody,
    CardFooter,
    Center,
    Flex,
    Input,
    Text
} from '@chakra-ui/react';
import {useLayoutEffect, useState} from 'react';
import {mutate} from 'swr';
import useSWRMutation from 'swr/mutation';
import {getFromStorage, saveToStorage} from '@/shared/utils/LocalStorageUtils';
import {useRouter} from 'next/navigation';

type LoginRequestBody = {
    username: string;
    password: string;
}
const loginFetcher = async (url: string, arg: { arg: LoginRequestBody}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
    });

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        const resBody = await res.json();
        error.message = resBody.message;
        error.name = String(res.status);
        throw error;
    }
    return res.json();
};

export default function AdminHome(){
    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const router = useRouter();
    const { error,trigger } = useSWRMutation(
        '/api/admin/auth/login',
        loginFetcher,
        {
            onSuccess: async (data) => {
                saveToStorage("auth", JSON.stringify(data))
                await mutate('/api/admin/auth/login',data)
                console.log('Login successful!', data);
            },
        }
    );

    const handleLogin = async () => {
        try{
            const res = await trigger({username:username, password:password})
            console.log(res)
        }catch(e){
            console.error(e)
        }

    }

    useLayoutEffect(() => {
        if(getFromStorage('auth')){
            router.push('/admin/manage')
        }
    })

    return (
        <Center>
            <Card>
                <CardBody>
                    <Flex flexDirection={'column'} gap={3}>
                        <Text>Welcome to the admin screen</Text>
                        <Input placeholder={'Input username'} type={'text'} onChange={e => setUsername(e.target.value)}/>
                        <Input placeholder={'Input admin password'} type={'password'} onChange={e => setPassword(e.target.value)}/>
                        <Button onClick={handleLogin}>Login</Button>
                    </Flex>
                </CardBody>
                <CardFooter>
                    {error && (
                        <Alert status="error" borderRadius={4}>
                            <AlertIcon />
                            <AlertDescription>Error - {error.message}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </Center>
    )
}