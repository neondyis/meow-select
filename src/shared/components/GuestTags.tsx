import { Tag, TagCloseButton, TagLabel, Wrap, WrapItem } from "@chakra-ui/react";
import {Guest} from '@/interfaces';

type GuestTagsProps = {
    guests: Guest[];
    onGuestRemove: (index: number) => void;
};

export default function GuestTags({ guests, onGuestRemove }: GuestTagsProps)  {
    if (!guests || guests.length === 0) {
        return <div>No guests found.</div>;
    }

    return (
        <Wrap>
            {guests.map((guest, index) => (
                <WrapItem key={guest.id}>
                    <Tag size="md" variant="subtle" colorScheme="blue">
                        <TagLabel>{guest.name}</TagLabel>
                        <TagCloseButton onClick={() => onGuestRemove(index)}/>
                    </Tag>
                </WrapItem>
            ))}
        </Wrap>
    );
};