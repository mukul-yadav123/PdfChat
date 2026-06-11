"use client"

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    FileText, 
    Download, 
    Eye, 
    EyeOff, 
    ChevronDown, 
    ChevronUp,
    MessageSquare,
    BookOpen
} from 'lucide-react'

interface Doc {
    pageContent?: string;
    metadata?: {
        page?: number;
        source?: string;
    }
}

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: Doc[];
}

interface ChatProps {
    uploadedFileName: string | null;
}

const ChatComponent: React.FC<ChatProps> = ({ uploadedFileName }) => {
    const { user } = useUser()
    const [message, setMessage] = React.useState<string>('')
    const [messages, setMessages] = React.useState<IMessage[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [expandedRefs, setExpandedRefs] = React.useState<{ [key: string]: boolean }>({})
    const chatEndRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom of chat
    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    const handleSendChatMessage = async () => {
        if (!message.trim()) return

        const currentMsg = message;
        setMessage('')
        setMessages(prev => [...prev, { role: 'user', content: currentMsg }])
        setIsLoading(true)

        try {
            const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(currentMsg)}`)
            const data = await res.json()
            setMessages(prev => [
                ...prev, 
                { 
                    role: "assistant", 
                    content: data?.message, 
                    documents: data?.docs 
                }
            ])
        } catch (err) {
            console.error('Chat API error:', err)
            setMessages(prev => [
                ...prev, 
                { 
                    role: "assistant", 
                    content: "Sorry, I encountered an error. Please make sure the backend server is running and try again." 
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const toggleReference = (msgIndex: number, refIndex: number) => {
        const key = `${msgIndex}-${refIndex}`
        setExpandedRefs(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const getFilenameFromPath = (path?: string) => {
        if (!path) return 'document.pdf';
        const parts = path.replace(/\\/g, '/').split('/');
        const rawFilename = parts[parts.length - 1] || 'document.pdf';
        const dashIndex = rawFilename.indexOf('-');
        return dashIndex !== -1 ? rawFilename.substring(dashIndex + 1) : rawFilename;
    }

    const handleDownload = (sourcePath?: string) => {
        if (!sourcePath) return;
        window.open(`http://localhost:8000/download?path=${encodeURIComponent(sourcePath)}`, '_blank');
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
                        <MessageSquare className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-200">Chat Session</h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            {uploadedFileName ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Chatting with: <span className="text-violet-400 font-medium truncate max-w-[150px]">{uploadedFileName}</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Upload a PDF to begin
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto pt-16">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200">Start Your PDF Chat</h3>
                        <p className="text-sm text-slate-400 mt-2">
                            Upload your documents on the left panel, and ask questions here. The assistant will reference specific pages to answer your queries.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {msg.role === 'user' ? (
                                    user?.imageUrl ? (
                                        <img 
                                            src={user.imageUrl} 
                                            alt="User Avatar" 
                                            className="w-10 h-10 rounded-xl border border-violet-500/30 object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                                            <User className="w-5 h-5 text-violet-400" />
                                        </div>
                                    )
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shadow-md shadow-indigo-950/50">
                                        <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {/* Message Content Container */}
                            <div className="space-y-2 max-w-[85%]">
                                <div 
                                    className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-md
                                        ${msg.role === 'user' 
                                            ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-none' 
                                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}
                                >
                                    {msg.content}
                                </div>

                                {/* Source references list */}
                                {msg.documents && msg.documents.length > 0 && (
                                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-900">
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            Sources & References ({msg.documents.length})
                                        </div>
                                        <div className="grid gap-2 grid-cols-1">
                                            {msg.documents.map((doc, docIdx) => {
                                                const filename = getFilenameFromPath(doc.metadata?.source);
                                                const pageNum = doc.metadata?.page !== undefined ? doc.metadata.page + 1 : 1;
                                                const isExpanded = !!expandedRefs[`${index}-${docIdx}`];

                                                return (
                                                    <div 
                                                        key={docIdx} 
                                                        className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex flex-col gap-2 hover:border-slate-800 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                                                <span className="text-xs text-slate-300 font-medium truncate" title={filename}>
                                                                    {filename}
                                                                </span>
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 flex-shrink-0">
                                                                    Page {pageNum}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg"
                                                                    onClick={() => toggleReference(index, docIdx)}
                                                                    title={isExpanded ? "Hide Details" : "Show Details"}
                                                                >
                                                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-7 w-7 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg"
                                                                    onClick={() => handleDownload(doc.metadata?.source)}
                                                                    title="Download Source PDF"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Collapsible reference content snippet */}
                                                        {isExpanded && doc.pageContent && (
                                                            <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-900/60 font-mono leading-normal whitespace-pre-wrap max-h-36 overflow-y-auto mt-1">
                                                                {doc.pageContent}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Loader showing three bouncing dots when fetching */}
                {isLoading && (
                    <div className="flex gap-4 max-w-3xl mr-auto">
                        <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shadow-md">
                            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 min-w-[70px] justify-center shadow-md">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                            </div>
                            <span className="text-[10px] text-slate-500 pl-1">AI is reading the document...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto flex gap-2 relative">
                    <Input 
                        placeholder="Type your query about the PDF..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && message.trim() && !isLoading) {
                                handleSendChatMessage();
                            }
                        }}
                        className="bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-xl pr-12 py-6"
                        disabled={isLoading}
                    />
                    <Button 
                        onClick={handleSendChatMessage} 
                        disabled={!message.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg p-2.5 h-auto transition-all shadow-md shadow-violet-600/15"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChatComponent