'use client';

import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import React from "react";
import {Box, Container, Flex, Grid, Heading, Spinner, Text,} from "@chakra-ui/react";
import {Guest, Topic_Block} from "@/interfaces";

export default function RoomComponent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { data: roomData,isLoading } = useSWR(`/api/guest/rooms/${id}`, { refreshInterval: 10000 });
    const assignedGuests = roomData?.blocks.filter((block: Topic_Block) => block.guest !== null).map((block:Topic_Block) => block.guest);
    const waitingGuests = roomData?.guests.filter((guest: Guest) => !assignedGuests.some((assigned:Guest) => assigned.id === guest.id));

    if (isLoading) {
        return (
            <Container maxW="container.lg">
                <Flex alignItems="center" justifyContent="center" minHeight="100vh">
                    <Spinner size="xl" />
                </Flex>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg">
            <Flex justify={'center'}>
                <Text fontSize={'2xl'} color={'whiteAlpha.900'} as="h1" mb="8">
                    Room Code - {roomData.id}
                </Text>
            </Flex>
            {assignedGuests.length > 0 ?
            <Box>
                <Grid templateColumns={[
                    "repeat(1, 1fr)",
                    "repeat(auto-fit, minmax(50px, 1fr))",
                    "repeat(6, 1fr)",
                ]} gap={6}>
                    {roomData.blocks.map((block:Topic_Block) => (
                        <Box
                            key={block.id}
                            borderWidth="1px"
                            borderRadius='md'
                            borderColor={block.guest ? "#8FA3EC": "#51629e"}
                            overflow="hidden"
                            bg={block.guest ? "#51629e" : "#8FA3EC"}
                            boxShadow="md"
                            paddingTop={7}
                            minH="125px"
                            minW="70px"
                        >
                                {block.guest &&
                                    <Flex flexDirection={'column'} justify="space-between" alignItems="center" mb={2} gap={5} textColor={'whiteAlpha.900'}>
                                        <Text fontSize={'lg'} noOfLines={[1, 2, 3]}>{block.content}</Text>
                                        <Text fontSize={'lg'} color={'#bac9ff'} noOfLines={[1, 2, 3]}>{block.guest ? block.guest['name'] : "Empty"}</Text>
                                    </Flex>
                                }
                        </Box>
                    ))}
                </Grid>
            </Box>
                :
                <Box>
                    <Flex flexDirection="column" gap={2} justify="center" alignItems="center">
                        <Heading variant={'section-title'} as="h2" size="lg">
                            Waiting for guests to join...
                        </Heading>
                        <Text fontSize={'xl'} color={'whiteAlpha.900'}>
                            {roomData.guests.length} out of {roomData.size} guests have joined
                        </Text>
                        <Grid templateColumns={[
                            "repeat(1, 1fr)",
                            "repeat(auto-fit, minmax(50px, 1fr))",
                            "repeat(4, 1fr)",
                        ]} gap={6}>
                            {roomData.guests.map((guest:Guest) => (
                                <Box
                                    key={guest.id}
                                    borderWidth="1px"
                                    borderRadius='md'
                                    borderColor={"#8FA3EC"}
                                    overflow="hidden"
                                    bg={"#42518B"}
                                    boxShadow="md"
                                    paddingTop={2}
                                    minH="50px"
                                    minW="200px"
                                >
                                    <Text align={'center'} fontSize={'2xl'} color={'whiteAlpha.900'} noOfLines={[1, 2, 3]}>{guest.name}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </Flex>
                </Box>
            }

        </Container>
    )
}