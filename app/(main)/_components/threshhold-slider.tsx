import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import useThreshold from "@/store/threshold";
import { Input } from "@/components/ui/input";

type SliderProps = React.ComponentProps<typeof Slider>;

export function ThresholdSlider({ className, ...props }: SliderProps) {
    const { setValue, value } = useThreshold();

    const handleSliderChange = (value: number[]) => {
        setValue({ newValue: value[0] / 100 });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.min(100, Math.max(0, Number(e.target.value)));
        setValue({ newValue: newValue / 100 });
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-mono rounded-sm bg-primary/5 px-1">Umbral</span>
            <Slider
                value={[value * 100]}
                max={100}
                step={1}
                className={cn("w-1/2", className)}
                onValueChange={handleSliderChange}
                {...props}
            />
            {/* <span className="text-muted-foreground text-sm font-mono">{Math.round(value * 100)}%</span> */}
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    value={Math.round(value * 100)}
                    onChange={handleInputChange}
                    className="w-10 h-6 text-xs text-center font-mono p-0"
                />
                <span className="text-muted-foreground text-sm font-mono">%</span>
            </div>

        </div>
    );
}