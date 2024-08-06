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

export default function HoundCarousel() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex-grow max-w-max text-center">
                <Carousel
                    opts={{
                        loop: true,
                        align: "center",
                    }}
                    plugins={[
                        Autoplay({
                            delay: 4000,
                        }),
                    ]}
                    className="w-full max-w-2xl"
                >
                    <CarouselContent>
                        <CarouselItem
                            className='flex justify-center items-center'
                        >
                            <div className='p-1 w-[1200px]'>
                                <Card className='h-[400px]'>
                                    <CardContent className='flex items-center justify-center p-6'>
                                        <img
                                            src="/light_graph.png"
                                            alt="Light Graph"
                                            className="aspect-video object-cover rounded-sm dark:hidden"
                                        />
                                        <img
                                            src="/dark_graph.png"
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
                            <div className='p-1 w-[1200px]'>
                                <Card className='h-[400px]'>
                                    <CardContent className='flex items-center justify-center p-6'>
                                        <img
                                            src="/light_pair.png"
                                            alt="Light Pair"
                                            className="aspect-video object-cover rounded-sm dark:hidden"
                                        />
                                        <img
                                            src="/dark_pair.png"
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
            </div>
        </div>
    );
}