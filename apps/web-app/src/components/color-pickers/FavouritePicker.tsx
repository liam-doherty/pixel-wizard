import { createSignal, Index, onMount, type Component } from 'solid-js'
import type { PickerProps } from './IPickerProps'

export const FavouritePicker: Component<PickerProps> = (props) => {
    const [saveMode, setSaveMode] = createSignal(false)
    const [favourites, setFavourites] = createSignal<string[]>(
        Array(10).fill('#ffffff'),
    )

    const setFavMode = () => {
        setSaveMode(!saveMode())
    }

    const setFav = (index: number) => {
        const newFavs = favourites().with(index, props.selectedColor)
        setFavourites(newFavs)
        localStorage.setItem('favouriteColors', JSON.stringify(newFavs))
    }

    onMount(async () => {
        const savedFavs: string | null = localStorage.getItem('favouriteColors')
        if (savedFavs !== null) {
            setFavourites(JSON.parse(savedFavs))
        }
    })

    return (
        <div class="flex flex-col gap-3">
            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                Favourites
            </label>
            <div class="flex flex-wrap gap-5">
                <Index each={favourites()}>
                    {(favourite, i) => (
                        <div
                            class={
                                !saveMode()
                                    ? 'rounded-xl outline-2 outline-offset-2 cursor-pointer outline-solid'
                                    : 'rounded-xl outline-2 outline-offset-2 cursor-pointer outline-dashed'
                            }
                            style={{
                                'background-color': favourite(),
                                width: '20px',
                                height: '20px',
                            }}
                            onclick={() => {
                                console.log(saveMode())
                                if (saveMode()) {
                                    console.log('save mode')
                                    setFav(i)
                                } else {
                                    props.setSelectedColor(favourite())
                                }
                            }}
                        ></div>
                    )}
                </Index>
            </div>

            <button
                class="btn btn-square btn-primary btn-sm"
                onclick={() => {
                    setFavMode()
                }}
            >
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
    )
}
