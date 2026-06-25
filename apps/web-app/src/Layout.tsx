import { type ParentComponent } from 'solid-js'

const Layout: ParentComponent = (props) => {
    return (
        <>
            <div class="navbar shadow-sm">
                <span>Pixil Wizard</span>
            </div>
            {props.children}
        </>
    )
}

export default Layout
