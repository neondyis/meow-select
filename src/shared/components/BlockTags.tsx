import {
    Box,
    Button,
    Checkbox,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    Select,
    VStack
} from "@chakra-ui/react";
import {Guest, Topic_Block} from '@/interfaces';
import {useEffect, useState} from 'react';

type BlockTagsProps = {
    blocks: Topic_Block[];
    onBlockChange: (index: number, block: Topic_Block) => void;
    onBlockRemove: (index: number) => void;
    guests: Guest[];

    blockTrigger: any;
};

export default function BlockTags({blocks, onBlockChange, onBlockRemove, guests, blockTrigger}: BlockTagsProps) {
    const [selectedGuests, setSelectedGuests] = useState<{ id: string | undefined; name: string | undefined }[]>(blocks.map((b) => ({
        id: b.guest !== undefined || null ? b.guest?.id : undefined,
        name: b.guest !== undefined || null ? b.guest?.name : undefined,
    })));
    const [allowMultiSelection, setAllowMultiSelection] = useState(false);
    const [availableGuests, setAvailableGuests] = useState<Guest[]>([]);

    useEffect(() => {
        // Update available guests whenever selected guests or blocks change
        const assignedGuestIds = blocks.map((b) => b.guestId);
        const newAvailableGuests = guests.filter(
            (guest) => !assignedGuestIds.includes(guest.id)
        );
        setAvailableGuests(newAvailableGuests);
    }, [selectedGuests, blocks, guests]);


    const handleGuestChange = (index: number, guestId: string) => {
        const newSelectedGuests = [...selectedGuests];
        newSelectedGuests.splice(index, 1, {
            id: guestId,
            name: guests.find((guest) => guest.id === guestId)?.name || "",
        });
        setSelectedGuests(newSelectedGuests);
        const updatedBlock = {...blocks[index], guestId};
        onBlockChange(index, updatedBlock);
    };

    const handleRandomAssignment = async (index: number) => {
        // Get all the blocks that don't have guests assigned
        const unassignedBlocks = blocks.filter((block) => block.guest === null);

        // If there are no unassigned blocks or no available guests, return
        if (unassignedBlocks.length === 0 || availableGuests.length === 0) {
            return;
        }

        // A random available guest
        const randomGuestIndex = Math.floor(Math.random() * availableGuests.length);

        const randomBlock = unassignedBlocks[index - 1];
        const randomGuest = availableGuests[randomGuestIndex];

        // Update the block with the guest information
        const updatedBlock = {
            ...randomBlock,
            guestId: randomGuest.id
        };

        // Update the remote data
        try {
            await blockTrigger({content: updatedBlock, method: "PUT"});
            const selectedGuestsCopy = [...selectedGuests];
            selectedGuestsCopy.splice(index, 1, {id: randomGuest.id, name: randomGuest.name});
            setSelectedGuests(selectedGuestsCopy);
        } catch (e) {
            console.error(e);
        }
    };

    if (!blocks || blocks.length === 0) {
        return <div>No topic blocks found.</div>;
    }

    return (
        <Box>
            <Checkbox colorScheme='green' onChange={_ => setAllowMultiSelection(!allowMultiSelection)}>Allow multiple
                guests in one multiple topics</Checkbox>
            <VStack align="stretch" gap={2}>
                {blocks.map((block, index) => {
                    return (
                        <VStack
                            key={block.id}
                            alignItems={"center"}
                            justify={"space-between"}
                            flexWrap={"wrap"}
                        >
                            <Editable
                                width={'100%'}
                                textAlign='center'
                                defaultValue={block.content}
                                borderColor={'gray.200'}
                                border={'solid 1px'}
                                borderRadius={'5px'}
                                onSubmit={(value) =>
                                    onBlockChange(index, {
                                        ...block,
                                        content: value,
                                    })
                                }
                            >
                                <EditablePreview/>
                                <EditableInput size={5}/>
                            </Editable>
                            <Select
                                variant={"outline"}
                                placeholder={"None - Select a guest"}
                                value={selectedGuests[index]?.id}
                                onChange={(e) => handleGuestChange(index, e.target.value)}
                            >
                                {guests.map((guest) => (
                                    <option key={guest.id} value={guest.id}
                                            disabled={(!availableGuests.find(availableGuest => guest.id === availableGuest.id) && !allowMultiSelection)}>
                                        {guest.name}
                                    </option>
                                ))}
                            </Select>
                            <HStack>
                                <Button
                                    colorScheme="red"
                                    size={"sm"}
                                    onClick={() => onBlockRemove(index)}
                                >
                                    Remove Topic
                                </Button>
                                <Button colorScheme="purple" size={"sm"} onClick={() => handleRandomAssignment(index)}>
                                    Random Assign Guest
                                </Button>
                            </HStack>
                        </VStack>
                    );
                })}
            </VStack>
        </Box>
    );
}