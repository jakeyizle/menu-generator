import { Label } from "../ui/label"
import { Slider } from "../ui/slider"

export interface MenuDaySelectorProps {
    numberOfDays: number
    onNumberOfDaysChange: (numberOfDays: number[]) => void
}

export const MenuDaySelector = ({numberOfDays, onNumberOfDaysChange}: MenuDaySelectorProps) => {
    return (
        <div className="space-y-2">
        <Label>Number of Days: {numberOfDays}</Label>
        <div className="px-1">
            <Slider value={[numberOfDays]} min={1} max={7} step={1} onValueChange={onNumberOfDaysChange} />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1 day</span>
                <span>7 days</span>
            </div>
        </div>
    </div>
    )
}