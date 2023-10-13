import { Message, Room } from "@/types/models";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { v4 as uuid4 } from "uuid";
import axios from "axios";
import { HOST } from "@/constants";

export const useClient = defineStore("client", () => {
  const room: Ref<Room | null> = ref(null);
  const deviceId: Ref<string | null> = ref(null);

  async function createRoom(name: string | null): Promise<Room> {
    const { data } = await axios.post<Room>(
      `${HOST}/create-room`,
      {
        name,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    room.value = data;
    return data;
  }

  async function getRoom(id: string): Promise<Room> {
    const { data } = await axios.get<Room>(`${HOST}/get-room/${id}`);
    room.value = data;
    return data;
  }

  async function syncMessages(from?: string): Promise<Message[]> {
    if (!room.value) throw new Error("No room to sync messages");

    const url = new URL(`${HOST}/get-messages/${room.value.id}`);

    if (from) url.searchParams.set("from", from);

    const { data } = await axios.get<Message[]>(url.toString());

    if (from) room.value.messages = [...room.value.messages, ...data];
    else room.value.messages = data;

    return room.value.messages;
  }

  async function sendMessage(content: string): Promise<boolean> {
    if (!room.value) throw new Error("No room to send messages");

    if (deviceId.value == null) deviceId.value = uuid4();
    const { status } = await axios.post(
      `${HOST}/post-messages`,
      {
        chatroom_id: room.value.id,
        content,
        device_id: deviceId.value,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return status === 204;
  }

  function leaveRoom() {
    room.value = null;
    deviceId.value = null;
  }

  return {
    room,
    getRoom,
    createRoom,
    leaveRoom,
    syncMessages,
    sendMessage,
  };
});
