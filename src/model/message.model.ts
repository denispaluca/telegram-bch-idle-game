import mongoose from 'mongoose';

interface MessageDocument extends mongoose.Document {
    telegramId: number;
    content: string[];
}

const MessageSchema = new mongoose.Schema(
    {
        telegramId: { type: Number, required: true, unique: true },
        content: { type: [String], default: [] },
    }
)

const Message = mongoose.model<MessageDocument>('Message', MessageSchema);

export { Message, MessageDocument };
