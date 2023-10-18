<template>
    <div class="console">
        <div class="console-header">
            <span class="console-btn console-btn-red"></span>
            <span class="console-btn console-btn-yellow"></span>
            <span class="console-btn console-btn-green"></span>
        </div>
        <div class="console-body">
            <p class="console-text pl-4"><span v-if="input">{{ input }}</span><span class="console-cursor" v-if="isBlinking">|</span></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: "",
            isBlinking: true
        };
    },
    mounted() {
        setInterval(() => {
            this.isBlinking = !this.isBlinking;
        }, 500);
    }
}
</script>

<style scoped>
.console {
    @apply bg-black text-white p-4 rounded-lg shadow-lg relative;
}

.console-header {
    @apply flex space-x-2 absolute -top-6 right-4;
}

.console-btn {
    @apply w-3 h-3 rounded-full;
}

.console-btn-red {
    @apply bg-red-500;
}

.console-btn-yellow {
    @apply bg-yellow-500;
}

.console-btn-green {
    @apply bg-green-500;
}

.console-body {
    @apply mt-4;
}

.console-text {
    @apply font-mono;
}

.console-cursor {
    @apply bg-white animate-blink;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
