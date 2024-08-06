"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

export default function HoundCarousel() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    const messages: { [key: number]: string } = {
        1: "Visualiza las similitudes entre los archivos de los proyectos",
        2: "Examina lado a lado las diferencias entre los archivos comparados",
    };
    
    const message = messages[current] || "default message";
    

    React.useEffect(() => {
        if (!api) {
            return
        }
     
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex-grow max-w-max text-center">
                <Carousel
                    setApi={setApi} 
                    opts={{
                        loop: true,
                        align: "center",
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    className="w-full max-w-2xl"
                >
                    <CarouselContent>
                        <CarouselItem
                            className='flex justify-center items-center'
                        >
                            <div className='w-[1200px]'>
                                <Card className='h-[400px]'>
                                    <CardContent className='flex items-center justify-center p-2'>
                                        <Image
                                            src="/light_graph.png"
                                            width={1200}
                                            height={400}
                                            alt="Light Graph"
                                            className="aspect-video object-cover rounded-sm dark:hidden"
                                        />
                                        <Image
                                            src="/dark_graph.png"
                                            width={1200}
                                            height={400}
                                            alt="Dark Graph"
                                            className="aspect-video object-cover rounded-sm hidden dark:block"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem
                            className='flex justify-center items-center'
                        >
                            <div className='w-[1200px]'>
                                <Card className='h-[400px]'>
                                    <CardContent className='flex items-center justify-center p-2'>
                                        <Image
                                            src="/light_pair.png"
                                            width={1200}
                                            height={400}
                                            alt="Light Pair"
                                            className="aspect-video object-cover rounded-sm dark:hidden"
                                        />
                                        <Image
                                            src="/dark_pair.png"
                                            width={1200}
                                            height={400}
                                            alt="Dark Pair"
                                            className="aspect-video object-cover rounded-sm hidden dark:block"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className='absolute left-[2rem] top-1/2 transform -translate-y-1/2 z-10' />
                    <CarouselNext className='absolute right-[2rem] top-1/2 transform -translate-y-1/2 z-10' />
                </Carousel>
                <div className="py-2 text-center text-xs text-muted-foreground">
                    {current}. {message}
                </div>
            </div>
        </div>
    );
}