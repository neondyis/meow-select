import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/modal';
import {Guest, Room, Topic_Block} from '@/interfaces';
import {
    Button,
    Input,
    NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import BlockTags from '@/shared/components/BlockTags';
import GuestTags from '@/shared/components/GuestTags';
import useSWRMutation from 'swr/mutation';

interface RoomChangeData {
    content: Topic_Block | Guest | Room
    method: string
}


async function ChangeBlock(
    url: string,
    {arg}: { arg: RoomChangeData }
) {
    const res = await fetch(url, {
        method: arg.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg.content),
    });

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        // Attach extra info to the error object.
        const resBody = await res.json();
        error.message = resBody.message;
        error.name = String(res.status);
        throw error;
    }

    return res.json();
}

export default function AdminManageRoomModal({room, isOpen, onClose}: AdminManageRoomModalProps) {
    const [guests, setGuests] = useState<Guest[] | []>(room.guests || []);
    const [blocks, setBlocks] = useState<Topic_Block[] | []>(room.blocks || []);
    const [roomSize, setRoomSize] = useState<string | number>(room.size)
    const [newBlockContent, setNewBlockContent] = useState<string>('');

    useEffect(() => {
        if (room.blocks && room.blocks.length > 0 && room.guests && room.guests.length > 0) {
            setGuests(room.guests);
            setBlocks(room.blocks);
        }
    }, [room]);

    const handleGuestChange = (index: number, newName: string) => {
        const newGuests = [...guests];
        const updatedGuest = {...newGuests[index], name: newName};
        newGuests.splice(index, 1, updatedGuest);
        setGuests(newGuests);
    };

    const handleRemoveGuest = async (index: number) => {
        try {
            const newGuests = [...guests];
            const deletedGuest = newGuests.splice(index, 1)[0];
            await guestTrigger({content: deletedGuest, method: "DELETE"});
            setGuests([...newGuests]);
            const newBlocks = [...blocks];
            const block = newBlocks.find(b => b.guestId === deletedGuest.id);
            if(block !== undefined){
                block!.guestId = "";
                await blockTrigger({content: block!, method: "PUT"})
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleBlockChange = async (index: number, block: Topic_Block) => {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1, block);
        try {
            await blockTrigger({content: block, method: "PUT"});
            setBlocks(newBlocks);
        } catch (e) {
            console.error(e);
        }
    };

    const {trigger: blockTrigger, isMutating} = useSWRMutation(
        "/api/admin/topics",
        ChangeBlock,
        {}
    );

    const {trigger: guestTrigger, isMutating: guestIsMutating} = useSWRMutation(
        "/api/admin/guests",
        ChangeBlock,
        {}
    );


    const {trigger: roomTrigger, isMutating: roomIsMutating} = useSWRMutation(
        "/api/admin/rooms",
        ChangeBlock,
        {}
    );

    const handleRemoveBlock = async (index: number) => {
        try {
            const newBlocks = [...blocks];
            const deletedBlock = newBlocks.splice(index, 1)[0];
            await blockTrigger({content: deletedBlock, method: "DELETE"});
            setBlocks([...newBlocks]);
        } catch (e) {
            console.error(e);
        }
    }

    const handleAddBlock = async () => {
        try {
            let newBlock = {
                id: "",
                content: newBlockContent,
                guestId: undefined,
                roomId: room.code
            };
            newBlock = await blockTrigger({content: newBlock, method: "POST"});
            if (!isMutating) {
                setBlocks([...blocks, newBlock]);
                setNewBlockContent('');
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleRoomSizeChange = async () => {
        await roomTrigger({content: {id: room.id, size: +roomSize,code: room.code},method:"PUT"})
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent textColor={'whiteAlpha.900'}>
                <ModalHeader backgroundColor={'#51629e'}>Room Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody backgroundColor={'#51629e'}>
                    <Stack spacing="4">
                        <Input type="text" value={room.code} readOnly={true}/>
                        <NumberInput min={1}  max={30} value={roomSize} onChange={setRoomSize} onBlur={handleRoomSizeChange}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Input
                            value={newBlockContent}
                            onChange={(e) => setNewBlockContent(e.target.value)}
                            placeholder="Enter block content"
                        />
                        <Button onClick={handleAddBlock} isDisabled={newBlockContent.length === 0}>
                            Add Block
                        </Button>
                    </Stack>
                    <div>
                        <strong>Guests:</strong>
                        <GuestTags guests={guests} onGuestRemove={handleRemoveGuest}/>
                    </div>
                    <div>
                        <strong>Topic Blocks:</strong>
                        <BlockTags blocks={blocks} onBlockChange={handleBlockChange} onBlockRemove={handleRemoveBlock} guests={guests} blockTrigger={blockTrigger}/>
                    </div>
                </ModalBody>
                <ModalFooter backgroundColor={'#51629e'}>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

interface AdminManageRoomModalProps {
    room: Room;
    isOpen: boolean;
    onClose: () => void;
}