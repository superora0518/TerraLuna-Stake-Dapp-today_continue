import React, { FunctionComponent, useState } from 'react';
import { Stack, Flex, HStack, Button, Text, Divider } from '@chakra-ui/react'
import { Deposit, MsgExecuteContract, WasmAPI, Coin } from '@terra-money/terra.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import CoinTab from './CoinTab';
import InputPanel from './InputPanel';
import SliderWish from './SliderWish';
import Info from './Info';
import WarningModal from './Warning';

interface Props{
  isOpen: boolean,
  onClose: () => void,
}
const WithdrawModal: FunctionComponent<Props> = ({isOpen, onClose}) => {
  const [amount, setAmount] = useState('0');
  const { isOpen: isOpenWarning, onOpen: onOpenWarning, onClose: onCloseWarning } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent 
        background={'#212121'}
        rounded={'25px'}
        w={{sm:'80%', md: '562px', lg:'562px'}}
        minW={{sm:'80%', md: '562px', lg:'562px'}}
        h={'453px'}
        px={{sm:'10px', md: '47px', lg: '47px'}}
        py={'39px'}
      >
        <HStack
          fontSize={'20px'}
          lineHeight={'24px'}
          color={'white'}
          justifyContent={'center'}
          mx={'100px'}
          spacing={'8px'}
        >
          <Text
            fontSize={'20px'}
            fontWeight={'860'}
            lineHeight={'24px'}
          >
            Withdraw
          </Text>
          <CoinTab/>
        </HStack>
        <InputPanel amount={amount} setAmount={setAmount}/>
        <SliderWish amount={amount} setAmount={setAmount}/>
        <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <Info amount={amount}/>
        <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <Button 
          w={'100%'} 
          h={'45px'} 
          mt={'26px'} 
          background={'#493C3C'} 
          rounded={'25px'}
          onClick={() => {
            if(parseFloat(amount) > 0){
                onOpenWarning()
            }
          }}
        >
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
          >
            Proceed
          </Text>
        </Button>
        <ModalCloseButton color={'#CEBFBF'} />
        <WarningModal onClose={onCloseWarning} isOpen={isOpenWarning} onCloseParent = {onClose} amount={amount}/>
      </ModalContent>
    </Modal>
  );
}
export default WithdrawModal;

