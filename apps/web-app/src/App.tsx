import { createSignal } from 'solid-js'

import './App.css'
import { isBlank, helloWorld } from 'common'
import { Player } from 'common'

import Layout from './Layout'
import Grid2D from './grid2d/Grid2D'
import {
    DefaultPicker,
    RGBPicker,
} from './components/color-pickers/DefaultPicker'
import { useMutation, useQuery } from '@tanstack/solid-query'

function App() {
    const [selectedColor, setSelectedColor] = createSignal('#000000')

    const onChangeColor = (newCol: string) => {
        setSelectedColor(newCol)
    }

    const query = useQuery(() => ({
        queryKey: ['hello'],
        queryFn: () =>
            fetch('http://localhost:3000/').then((res) => res.text()),
    }))

    const mutation = useMutation(() => ({
        mutationFn: (data: Player) => {
            return fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
        },
    }))
    const onSubmit = async (event: any) => {
        event.preventDefault()
        const player: Player = {
            color: selectedColor(),
        }
        try {
            const result = await mutation.mutateAsync(player)
            alert(await result.text())
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Layout>
            <p>sending hello - {helloWorld('Liam')}</p>
            <p>API: {query.data ?? 'loading...'}</p>

            <button class="btn" onclick={onSubmit}>
                Send
            </button>

            <input
                type="color"
                value={selectedColor()}
                onInput={(e) => onChangeColor(e.currentTarget.value)}
            ></input>

            <DefaultPicker
                selectedColor={selectedColor()}
                setSelectedColor={onChangeColor}
            />

            <RGBPicker
                selectedColor={selectedColor()}
                setSelectedColor={onChangeColor}
            />
            <div style="display: flex; justify-content: center;">
                <Grid2D selectedColor={selectedColor()} />
            </div>
        </Layout>
    )
}

export default App
