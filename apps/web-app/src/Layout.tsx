import { type ParentComponent } from 'solid-js'

const Layout: ParentComponent = (props) => {
    return (
        <div class="min-h-screen flex flex-col bg-base-100">
            <div class="navbar bg-base-200 shadow-sm px-4">
                <img src="hat.png" width="40px" height="40px" />
                <span class="pixelify-sans-700">Pixel Wizard</span>
            </div>
            <div class="flex flex-1">{props.children}</div>
        </div>
    )
}

export default Layout
