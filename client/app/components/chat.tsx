"use client"

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ChatComponent: React.FC = () => {

    const [message,setMessage] = React.useState<string>('')
    const [messages,setMessages] = React.useState([])

    const handleSendChatMessage = async() =>{
        const res = await fetch(`http://localhost:8000/chat?message=${message}`)
        const data = await res.json();
        console.log(data)
    }
    return (
        <div className='p-4'>
            <div className='fixed bottom-4 w-100 flex gap-2'>
                <Input placeholder='Type your query here' value={message} onChange={(e) => setMessage(e.target.value)}/>
                <Button onClick={handleSendChatMessage} disabled={!message.trim()}>Send</Button>
            </div>
        </div>
    )
}

export default ChatComponent