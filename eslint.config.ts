import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslistPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    {
        ignores: [
            'coverage',
            '**/public',
            '**/dist',
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
        ],
    },
    tseslint.configs.recommended,
    eslistPluginPrettierRecommended,
])
