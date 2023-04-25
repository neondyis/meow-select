'use client';
import {Box, Card, CardBody, CardHeader, Flex} from '@chakra-ui/react';

export default function AdminBody({children, header}: AdminLayoutProp) {
    return (
        <Box>
            <Flex align={'center'} justify={'center'} h={'100%'}>
                <Card w={['auto','300px','500px']}  backgroundColor={'#51629e'} textColor={'whiteAlpha.900'}>
                    <CardHeader textAlign={'center'}>
                        {header}
                    </CardHeader>
                    <CardBody>
                        {children}
                    </CardBody>
                </Card>
            </Flex>
        </Box>
    )
}

type AdminLayoutProp = {
    children: React.ReactNode
    header: string
}