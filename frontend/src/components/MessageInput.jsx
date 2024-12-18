import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'
function MessageInput() {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const fileInputRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setImagePreview(reader.result)
    }

    reader.readAsDataURL(file);
  }

  const removeImage = (e) => {
    setImagePreview(null)
    if(fileInputRef.current) {fileInputRef.current.value = ""}
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      })

      setText("")
      setImagePreview("")
      if(fileInputRef.current) {fileInputRef.current.value = ""}
    } catch (error) {
      console.log("Fail to send image", error);
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Image Preview" className="size-20 object-cover rounded-lg border border-zinc-700" />
            <button className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              onClick={removeImage}
              type='button'
            >
              <X className="size-3" />
            </button>

          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="w-full input-bordered rounded-lg input-sm sm:input-md"
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            type='button'
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />

          </button>
        </div>
        <button
          className='btn btn-circle'
          type='submit'
          disabled={!imagePreview && !text.trim()}
        >
          <Send size={25} />

        </button>
      </form>
    </div>
  )
}

export default MessageInput