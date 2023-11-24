<template>
    <div>
        {{ props.roomInfos }}
    </div>

    <div class="restart-room">
        <button class="full-button" @click="restartGame()">Quitter la Room</button>
    </div>
</template>

<script setup>


const props = defineProps({
    roomInfos: Object
});

const emit = defineEmits(['restartGame']);

</script>