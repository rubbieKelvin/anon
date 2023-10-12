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
    const { data } = await axios.request<Room>({
      method: "post",
      url: `${HOST}/createroom`,
      data: JSON.stringify({ name }),
    });

    room.value = data;
    return data;
  }

  async function syncMessages(from: string | null): Promise<Message[]> {
    return [];
  }

  async function sendMessage(content: string): Promise<boolean> {
    if (deviceId.value == null) deviceId.value = uuid4();
    return true;
  }

  function leaveRoom() {
    room.value = null;
    deviceId.value = null;
  }

  return {
    room,
    createRoom,
    leaveRoom,
    syncMessages,
    sendMessage,
  };
});
