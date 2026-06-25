import { createSignal } from 'solid-js'

import './App.css'
import { isBlank, helloWorld } from 'common'
//import type { Player } from 'common'

import Layout from './Layout'
import Grid2D from './grid2d/Grid2D'
import {
    DefaultPicker,
    RGBPicker,
} from './components/color-pickers/DefaultPicker'

function App() {
    const [selectedColor, setSelectedColor] = createSignal('#000000')

    const onChangeColor = (newCol: string) => {
        setSelectedColor(newCol)
    }

    return (
        <Layout>
            <p>sending hello - {helloWorld('Liam')}</p>

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
