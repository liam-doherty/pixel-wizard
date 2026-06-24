import { createSignal } from 'solid-js'

import './App.css'
import { isBlank, helloWorld } from 'common'
//import type { Player } from 'common'

function App() {
    const [count, setCount] = createSignal(0)

    return (
        <>
            <section id="center">
                <div>
                    <h1>Get started</h1>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test{' '}
                        <code>HMR</code>
                    </p>
                </div>
                <button
                    type="button"
                    class="counter"
                    onClick={() => setCount((count) => count + 1)}
                >
                    Count is {count()}
                </button>
                <p>sending hello - {helloWorld('Liam')}</p>
                <p>false isBlank - {isBlank(false) ? 'true' : 'false'}</p>
                <p>true isBlank - {isBlank(true) ? 'true' : 'false'}</p>
                <p>Empty object isBlank - {isBlank({}) ? 'true' : 'false'}</p>
            </section>
        </>
    )
}

export default App
