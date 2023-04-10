import {Flex, HStack} from '@chakra-ui/react';
import {Link} from '@chakra-ui/next-js';
import {removeFromStorage} from '@/shared/utils/LocalStorageUtils';

export default function AdminHeader(){

    const handleLogout = () => {
        removeFromStorage('auth')
    }

    return(
        <Flex h={'30px'} background={'#78c4ad'} flexDirection={'row'} justify={'space-between'}>
            <HStack>
                <Link href={'/'}>Home</Link>
            </HStack>
            <HStack>
                <Link href={'/admin/manage'}>Manage</Link>
                <Link href={'/admin/create'}>Create</Link>
                <Link onClick={handleLogout} href={'/'}>Logout</Link>
            </HStack>
        </Flex>
    )
}