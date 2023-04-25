'use client';
import {Box, Flex, Tag, useDisclosure} from '@chakra-ui/react';
import AdminBody from '@/shared/components/AdminBody';
import {useEffect, useState} from 'react';
import {Room} from '@/interfaces';
import useSWR from 'swr';
import AdminManageRoomModal from '@/shared/components/AdminManageRoomModal';

export default function AdminManage() {
    const {data, isLoading, error} = useSWR('/api/admin/rooms',{ refreshInterval: 10000 });
    const [roomList, setRoomList] = useState<Room[]>([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedRoom,setSelectedRoom] = useState<Room>();

    useEffect(() => {
        if (!isLoading) {
            setRoomList(data)
        }
    }, [data])

    const handleRoomSelection = (room:Room) => {
        setSelectedRoom(room);
        onOpen();
    }


    return (
        <Box>
            <AdminBody header={'Manage existing rooms'}>
                {error && <p>An error has occurred when trying to retrieve the rooms</p>}
                {(!isLoading && !error) &&
                    <Flex flexDirection={'column'} justify={'space-evenly'} gap={3}>
                        {roomList.map((room, index) => {
                            return (
                                <Box key={index}>
                                    <Tag variant='solid' colorScheme='yellow' justifyContent={'center'} onClick={_ => handleRoomSelection(room)}>{room.code}</Tag>
                                    {selectedRoom &&
                                        <AdminManageRoomModal room={selectedRoom!} isOpen={isOpen} onClose={onClose}/>
                                    }
                                </Box>
                            )
                        })}
        </Flex>
}
</AdminBody>

</Box>
)
}