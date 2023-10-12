<template>
  <div v-if="room">
    <p>Room: {{ room.name }}</p>
    <p>ID: {{ room.id }}</p>
    <RouterLink :to="{ name: 'room', params: { id: room.id } }"
      >Go to room</RouterLink
    >
    <button @click="leaveRoom">Leave room</button>
  </div>
  <div v-else>
    <h1>Create room</h1>
    <p>Enter room title</p>
    <input
      v-model.trim="room_title"
      type="text"
      placeholder="enter room name"
    />
    <button :disabled="creating_room" @click="create">
      {{ creating_room ? "Creating room..." : "Create room" }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useClient } from "@/stores/client";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { leaveRoom, createRoom, room } = useClient();
const router = useRouter();
const room_title = ref("");
const creating_room = ref(false);

function create() {
  creating_room.value = true;
  createRoom(room_title.value)
    .then((data) => {
      router.push({ name: "room", params: { id: data.id } });
    })
    .finally(() => {
      room_title.value = "";
      creating_room.value = false;
    });
}
</script>
