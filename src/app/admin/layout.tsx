'use client';
import {Flex} from '@chakra-ui/react'
import AdminHeader from '@/shared/components/AdminHeader';
import {ReactNode, useEffect, useState} from 'react';
import useSWR from 'swr';
import {getFromStorage} from '@/shared/utils/LocalStorageUtils';

function useAdminLogin(username: string) {
    const fetcher = async (url: string) => {
        const res = await fetch(url, {
            method: 'GET',
            body: JSON.stringify({ username }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('An error occurred while fetching the data.');
        }
        return res.json();
    };

    const { data, error, mutate } = useSWR(`/api/admin/auth/login`, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}
export default function AdminRootLayout({children,}: { children: ReactNode }) {
    const { data, isLoading, isError, mutate } = useAdminLogin(getFromStorage('auth') ? JSON.parse(getFromStorage('auth')).username : "");
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    useEffect(()=>{
        setIsLoggedIn(!!getFromStorage('auth'))
    },[data])

    return (
        <Flex h={'100%'} flexDirection={'column'} gap={12}>
            {isLoggedIn &&
                <AdminHeader/>
            }
            {children}
        </Flex>
    )
}