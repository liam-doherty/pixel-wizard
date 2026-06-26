import { type ParentComponent } from 'solid-js'

const Layout: ParentComponent = (props) => {
    return (
        <div class="min-h-screen flex flex-col bg-base-100">
            <div class="navbar bg-base-200 shadow-sm px-4">
                <span class="text-xl font-bold tracking-tight">Pixel Wizard</span>
            </div>
            <div class="flex flex-1">{props.children}</div>
        </div>
    )
}

export default Layout
