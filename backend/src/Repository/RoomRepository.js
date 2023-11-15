import RoomModel from '../Model/RoomModel.js';
class RoomRepository {
    model = null

    constructor() {
        this.model = RoomModel.getInstance().getModel();
    }

    createRoom = (roomCode, maxPlayers, status) => {
        return this.model.create({
            code: roomCode,
            currentPlayerNumber: 0,
            maxPlayers: maxPlayers,
            status: status,
        });
    }

    async getRoomByCode(roomCode) {
        return await this.model.findOne({ where: { code: roomCode } });
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
        return room.maxPlayers === room.currentPlayerNumber;
    }

    async isRoomClosed(roomCode) {
        let room = await this.getRoomByCode(roomCode);
        return room.status === "Closed";
    }

    async isRoomJoinable(roomCode) {
        return !(await this.isRoomFull(roomCode)) && !(await this.isRoomClosed(roomCode));
    }
}

export default RoomRepository;