"use client"

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Doc{
    pageContent?: string;
    metadata?: {
        page?: number;
        source?: string
    }
}

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: Doc[];
}
const ChatComponent: React.FC = () => {

    const [message,setMessage] = React.useState<string>('')
    const [messages,setMessages] = React.useState<IMessage[]>([])

    const handleSendChatMessage = async() =>{
        setMessages(prev => [...prev,{role: 'user',content:message}])
        const res = await fetch(`http://localhost:8000/chat?message=${message}`)
        const data = await res.json();
        setMessages(prev => [...prev,{role: "assistant",content: data?.message,documents:data?.docs}])
        console.log(data)
    }
    return (
        <div className='p-4'>
            <div>
                {messages?.map((message,index) => <pre key={index}>{JSON.stringify(message)}</pre>)}
            </div>
            <div className='fixed bottom-4 w-100 flex gap-2'>
                <Input placeholder='Type your query here' value={message} onChange={(e) => setMessage(e.target.value)}/>
                <Button onClick={handleSendChatMessage} disabled={!message.trim()}>Send</Button>
            </div>
        </div>
    )
}

export default ChatComponent