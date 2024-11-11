import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import useThreshold from "@/store/threshold"

type SliderProps = React.ComponentProps<typeof Slider>;

export function ThresholdSlider({ className, ...props }: SliderProps) {
    const { setValue, value } = useThreshold();

    const handleChange = (value: number[]) => {
        setValue({ newValue: value[0] / 100 });
    };

    return (
        <div className="flex items-center gap-2">
            <Slider
                defaultValue={[value * 100]}
                max={100}
                step={1}
                className={cn("w-1/2", className)}
                onValueChange={handleChange}
                {...props}
            />
            <span className="text-muted-foreground text-sm font-mono">{Math.round(value * 100) + "%"}</span>
        </div>
    );
}