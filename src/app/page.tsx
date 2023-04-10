'use client';
import {
    Alert,
    AlertDescription, AlertIcon,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select, Skeleton, Text
} from '@chakra-ui/react';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {Room} from '@/interfaces';
import {useRouter} from 'next/navigation';

interface JoinRoomData {
    name: string;
    roomCode: string;
    password: string;
}

async function joinRoom(url: string, {arg}: { arg: JoinRoomData }) {
    const res = await  fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    })

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        // Attach extra info to the error object.
        const resBody = await res.json()
        error.message = resBody.message
        error.name = String(res.status)
        throw error
    }

    return res.json()
}

export default function Home() {
    const [roomCode, setRoomCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    const {data: roomData, error} = useSWR('/api/admin/rooms');
    const {trigger, error:joinError} = useSWRMutation('/api/guest/rooms', joinRoom, {});

    const handleRoomCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRoomCode(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleJoinRoom = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try{
            const result = await trigger({name: username, roomCode, password})
            // use this after connecting to room to trigger an update on other users side
            // await mutate();
            await router.push(`/rooms?id=${result.roomId}`)
        }catch (e){
            console.error(e)
        }
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const SelectOption = {
        background:'#8fa3ec',
        transition: "background 0.3s ease",
        hover: {
            backgroundColor: "#51629e !important",
        },
       checked: {
            backgroundColor: "#51629e !important",
        },
    }

  return (
    <main>
        <Flex justifyContent="center" alignItems="center">
            {!roomData ? (
                <Skeleton height="20px" width="100%" my="2" />
            ) : (
          <Card w={['auto','300px','500px']} background={'#41518b'} textColor={'whiteAlpha.900'}>
              <CardHeader>
                  <Text fontSize={['md','2xl','5xl']} textAlign={'center'}>
                      Join a room
                  </Text>
              </CardHeader>
              <CardBody>
                  <Flex flexDirection={'column'} gap={3}>
                      <FormControl isRequired>
                          <FormLabel htmlFor="room-code">Choose a Room</FormLabel>
                          {roomData && (
                              <Select id="room-code" value={roomCode} onChange={handleRoomCodeChange} background={'#8fa3ec'}  focusBorderColor={'#7282bd'}>
                                  <option value="" style={SelectOption}>No Room</option>
                                  {roomData.map((room:Room) => (
                                      <option style={SelectOption} key={room.id} value={room.code}>
                                          {room.code} ({room.guests?.length}/{room.size})
                                      </option>
                                  ))}
                              </Select>
                          )}
                      </FormControl>
                      <FormControl isRequired >
                          <FormLabel htmlFor="username">Enter your name</FormLabel>
                          <Input id="username" value={username} background={'#8fa3ec'} borderColor={'whiteAlpha.900'}  focusBorderColor={'#7282bd'} textColor={'whiteAlpha.900'} onChange={handleUsernameChange} />
                      </FormControl>
                      <FormControl isRequired>
                          <FormLabel htmlFor="password">Enter a password</FormLabel>
                          <Input type="password" id="password" _autofill={{background:'#8fa3ec'}} background={'#8fa3ec'} borderColor={'whiteAlpha.900'} focusBorderColor={'#7282bd'} textColor={'whiteAlpha.900'} value={password} onChange={handlePasswordChange} />
                      </FormControl>
                      <Button variant={'outline'}  isDisabled={(roomCode === "" || username === "" || password === "")}  onClick={e => handleJoinRoom(e)}>
                          Join Room
                      </Button>
                  </Flex>
              </CardBody>
              <CardFooter>
                  <Flex justifyContent="center" alignItems="center" mt={2}>
                      {error && (
                          <Alert status="error" borderRadius={4}>
                              <AlertIcon />
                              <AlertDescription>Error loading rooms</AlertDescription>
                          </Alert>
                      )}
                      {joinError && (
                          <Alert status="error" borderRadius={4}>
                              <AlertIcon />
                              <AlertDescription>Error joining room: {joinError.message}</AlertDescription>
                          </Alert>
                      )}
                  </Flex>
              </CardFooter>
          </Card>)}
      </Flex>
    </main>
  )
}
