<template>
  <div v-if="!room">
    <h1>No room found</h1>
    <RouterLink :to="{ name: 'home' }">Go home</RouterLink>
  </div>
  <div v-else>
    <div>
      <h1>Room: {{ room.name }} ({{ room.id }})</h1>

      <div>
        <!-- message -->
        <div v-for="message in room.messages">
          {{ message.content }}
        </div>
      </div>

      <div>
        <input
          v-model.trim="message_input"
          type="text"
          placeholder="enter message"
          @keypress.enter="send_a_message"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClient } from "@/stores/client";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const { params } = useRoute();
const { getRoom, sendMessage, syncMessages } = useClient();

const room = computed(() => {
  const { room: v } = useClient();
  return v;
});

const message_input = ref("");
const is_syncing = ref(false);

const do_sync = () => {
  if (!room.value) throw new Error("No room to sync into");

  const msg_length = room.value.messages.length;

  if (is_syncing.value) return;

  is_syncing.value = true;

  const p_from =
    msg_length > 0
      ? room.value.messages[msg_length - 1].date_created
      : undefined;
  console.log({ p_from });

  syncMessages(p_from).finally(() => {
    is_syncing.value = false;
  });
};

onMounted(async () => {
  if (!room.value) await getRoom(params.id as string);

  if (room.value) {
    setInterval(do_sync, 3000);
  }
});

const send_a_message = () => {
  sendMessage(message_input.value).then((data) => {
    message_input.value = "";
    if (data) do_sync;
  });
};
</script>
