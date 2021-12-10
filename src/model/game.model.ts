import mongoose from 'mongoose';

interface GameDocument extends mongoose.Document {
    totalPlayers: number;
}

const GameSchema = new mongoose.Schema(
    {
        totalPlayers: { type: Number, required: true }
    }
)

const Game = mongoose.model<GameDocument>('Game', GameSchema);

export { GameDocument, Game };