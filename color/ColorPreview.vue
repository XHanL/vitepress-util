<template>
    <ClientOnly>
        <button :class="modeClass" @click="copyCode">
            <div class="color-container" :style="{ backgroundColor: color }" />
            <div class="container" v-if="copied">
                <div class="icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
                        <g fill="none">
                            <path
                                d="M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v4.707a5.48 5.48 0 0 0-1-.185V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h4.1c.183.358.404.693.657 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0zm-2.146-1.854a.5.5 0 0 0-.708 0L13.5 15.293l-.646-.647a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0 0-.708z"
                                fill="currentColor">
                            </path>
                        </g>
                    </svg>
                </div>
                Copied
            </div>
            <div v-else>
                <div class="text-container">{{ color }}</div>
            </div>
        </button>
    </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: "ColorPreview",
    props: {
        color: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            required: true,
            validator: (v: string) => ['system', 'light', 'dark'].includes(v)
        },
    },
    computed: {
        modeClass() {
            return `${this.mode}-mode`;
        }
    },
    methods: {
        copyCode() {
            try {
                navigator.clipboard.writeText(this.color)
            } catch (err) {
                console.log(err)
            }
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 2000)
        },
    },
    data() {
        return {
            hover: false,
            copied: false,
        }
    },
});
</script>

<style scoped>
button {
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1em 0.7em 0.1em 0.25em;
    border: 0.1em solid var(--vp-c-divider);
    border-radius: 999px;
    box-shadow: var(--vp-shadow-1);
}

.system-mode {
    background-color: var(--vp-c-bg);
    color: var(--vp-c-text-1);
}

.light-mode {
    background-color: rgba(255, 255, 255, 0.9);
    color: rgb(60, 60, 67);
}

.dark-mode {
    background-color: rgba(27, 27, 31, 0.85);
    color: rgba(255, 255, 245, 0.86);
}

button:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

button:active {
    transform: scale(0.99);
    transition: transform 0.1s ease;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-container {
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
}

.icon-container {
    width: 17px;
    height: 17px;
    padding-left: 1px;
    font-size: small;
}

.text-container {
    padding-left: 5px;
    font-size: small;
}
</style>
