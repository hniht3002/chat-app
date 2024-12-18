import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'

function ChatContainer() {
    const { selectedUser, getMessages, messages, isMessagesLoading } = useChatStore()
    const {authUser} = useAuthStore()
    useEffect(() => {
        getMessages(selectedUser._id)
    }, [selectedUser._id, getMessages])

    if (isMessagesLoading) return (
        <div className='flex flex-1 flex-col overflow-auto'>
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )
    return (
        <div className='flex-1 flex flex-col overflow-auto '>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div 
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start" }`}
                        key={message._id}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic} alt="profile pic" />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time datetime="" className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</time>
                        </div>

                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img src={message.image} 
                                    alt="Attachment" 
                                    className='sm:max-w-[200px] rounded-md mb-2'
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer