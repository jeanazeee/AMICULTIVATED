import RoomModel from '../Model/RoomModel.js';
import UserRepository from './UserRepository.js';
class RoomRepository {
    model = null
    userRepository = null
    constructor() {
        this.model = RoomModel.getInstance().getModel();
        this.userRepository = new UserRepository();
    }

    createRoom = (roomCode, maxPlayers, maxRounds, status, adminId) => {
        return this.model.create({
            code: roomCode,
            currentPlayerNumber: 1,
            maxPlayers: maxPlayers,
            maxRounds: maxRounds,
            status: status,
            adminId: adminId
        });
    }

    async getRoomByCode(roomCode) {
        const room = await this.model.findOne({ where: { code: roomCode } });
        if (!room) {
            return;
        }
        let roomData = {
            id: room.id,
            maxPlayers: room.maxPlayers,
            currentPlayerNumber: room.currentPlayerNumber,
            maxRounds: room.maxRounds,
            status: room.status,
            code: room.code,
            players: {}
        }
        roomData.players = (await this.userRepository.getUsersByRoomId(roomData.id)).map(user => {
            return {username: user.username, score: user.score};
        });
        return roomData;
    }

    async getRoomById(roomId) {
        return await this.model.findOne({ where: { id: roomId } });
    }

    async updateRoomStatus(roomCode, status) {
        return await this.model.update({ status: status }, { where: { code: roomCode } });
    }

    async incrementCurrentPlayerNumber(roomCode) {
        let room = await this.getRoomByCode(roomCode);
        return await this.model.update({ currentPlayerNumber: room.currentPlayerNumber + 1 }, { where: { code: roomCode } });
    }

    async decrementCurrentPlayerNumber(roomCode) {
        let room = await this.getRoomByCode(roomCode);
        return await this.model.update({ currentPlayerNumber: room.currentPlayerNumber - 1 }, { where: { code: roomCode } });
    }

    async isRoomFull(roomCode) {
        let room = await this.getRoomByCode(roomCode);

        if (!room) {
            return true;
        }

        return room.maxPlayers === room.currentPlayerNumber;
    }

    async isRoomClosed(roomCode) {
        let room = await this.getRoomByCode(roomCode);
        return room.status === "Finished" || room.status === "Stared";
    }

    async isRoomJoinable(roomCode) {
        return !(await this.isRoomFull(roomCode)) && !(await this.isRoomClosed(roomCode));
    }

    async updateMaxPlayers(roomCode, maxPlayers) {
        return await this.model.update({ maxPlayers: maxPlayers }, { where: { code: roomCode } });
    }
}

export default RoomRepository;