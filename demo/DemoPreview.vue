<template>
    <ClientOnly>
        <div class="demo" @mouseover="hover = true" @mouseleave="hover = false">
            <div class="demo-header">
                <div class="demo-header-prefix">
                    <div class="demo-header-prefix-title" v-html="decodeTitle" />
                    <div class="demo-header-prefix-desc" v-html="decodeDesc" />
                    <div class="demo-content">
                        <slot />
                    </div>
                </div>
                <transition name="fade">
                    <div class="demo-header-suffix" v-show="hover || copied">
                        <button class="demo-copy-button" @click="copyCode">
                            <div class="demo-copied-icon" v-if="copied">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 20 20">
                                    <g fill="none">
                                        <path
                                            d="M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v4.707a5.48 5.48 0 0 0-1-.185V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h4.1c.183.358.404.693.657 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0zm-2.146-1.854a.5.5 0 0 0-.708 0L13.5 15.293l-.646-.647a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0 0-.708z"
                                            fill="currentColor">
                                        </path>
                                    </g>
                                </svg>
                            </div>
                            <div class="demo-copy-icon" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 20 20">
                                    <g fill="none">
                                        <path
                                            d="M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM7.085 4H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1z"
                                            fill="currentColor">
                                        </path>
                                    </g>
                                </svg>
                            </div>
                        </button>
                        <button class="demo-code-button" @click="fold = !fold;">
                            <div class="demo-code-icon" v-if="fold">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 512 512">
                                    <path
                                        d="M160 389a20.91 20.91 0 0 1-13.82-5.2l-128-112a21 21 0 0 1 0-31.6l128-112a21 21 0 0 1 27.66 31.61L63.89 256l109.94 96.19A21 21 0 0 1 160 389z"
                                        fill="currentColor"></path>
                                    <path
                                        d="M352 389a21 21 0 0 1-13.84-36.81L448.11 256l-109.94-96.19a21 21 0 0 1 27.66-31.61l128 112a21 21 0 0 1 0 31.6l-128 112A20.89 20.89 0 0 1 352 389z"
                                        fill="currentColor"></path>
                                    <path
                                        d="M208 437a21 21 0 0 1-20.12-27l96-320a21 21 0 1 1 40.23 12l-96 320A21 21 0 0 1 208 437z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                            <div class="demo-code-slash-icon" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 512 512">
                                    <path
                                        d="M160 389a20.91 20.91 0 0 1-13.82-5.2l-128-112a21 21 0 0 1 0-31.6l128-112a21 21 0 0 1 27.66 31.61L63.89 256l109.94 96.19A21 21 0 0 1 160 389z"
                                        fill="currentColor"></path>
                                    <path
                                        d="M352 389a21 21 0 0 1-13.84-36.81L448.11 256l-109.94-96.19a21 21 0 0 1 27.66-31.61l128 112a21 21 0 0 1 0 31.6l-128 112A20.89 20.89 0 0 1 352 389z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </transition>
            </div>
            <div class="demo-footer" v-show="fold" v-html="decodeHighlight" />
        </div>
    </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DemoPreview',
    props: {
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        lang: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        highlight: {
            type: String,
            required: true,
        },
    },
    computed: {
        decodeTitle() {
            return decodeURIComponent(this.title);
        },
        decodeDesc() {
            return decodeURIComponent(this.desc);
        },
        decodeLang() {
            return decodeURIComponent(this.lang);
        },
        decodeCode() {
            return decodeURIComponent(this.code);
        },
        decodeHighlight() {
            return decodeURIComponent(this.highlight);
        },
    },
    methods: {
        copyCode() {
            try {
                navigator.clipboard.writeText(this.decodeCode)
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
            fold: false,
        }
    },
});
</script>

<style scoped>
.demo {
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    margin-bottom: 1.2em;
    transition: background-color 0.5s ease;
}

.demo p {
    margin: 0;
}

.demo button {
    background-color: var(--vp-c-bg-mute);
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    font-size: 0.9em;
    font-weight: 600;
    transition: background-color 0.5s ease;
}

.demo button:hover {
    box-shadow: inset 0 0 3px var(--vp-code-color);
    transition: box-shadow 0.2s ease;
}

.demo button:active {
    box-shadow: inset 0 0 5px var(--vp-code-color);
    transition: box-shadow 0.2s ease;
}

.demo button+button {
    margin-left: 6px;
}

.demo-header {
    position: relative;
}

.demo-header-prefix {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 18px;
}

.demo-header-prefix-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 10px;
}

.demo-header-prefix-desc {
    font-size: 0.9em;
}

.demo-header-suffix {
    position: absolute;
    display: flex;
    top: -6px;
    right: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.demo-copy-button,
.demo-code-button {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.demo-copy-icon,
.demo-copied-icon {
    width: 20px;
    height: 20px;
}

.demo-code-icon,
.demo-code-slash-icon {
    width: 17px;
    height: 17px;
}

.demo-content {
    margin-top: 20px;
    margin-bottom: 18px;
}
</style>

<style>
.demo-footer div[class*='language-'] {
    background-color: var(--vp-c-bg-elv);
    border-radius: 8px;
    margin: 3px;
    box-shadow: var(--vp-shadow-1);
}

.dark .demo-footer div[class*='language-'] {
    background-color: var(--vp-c-bg-alt);
    box-shadow: none;
}
</style>