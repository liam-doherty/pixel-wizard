import { type ParentComponent } from 'solid-js'

const MenuContentParent: ParentComponent = (props) => {
    return (
        <div class="card bg-base-200 w-56 shrink-0 h-fit">
            <div class="card-body gap-5 p-4">{props.children}</div>
        </div>
    )
}

export default MenuContentParent
