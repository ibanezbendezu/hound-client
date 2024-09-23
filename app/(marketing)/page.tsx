import {Footer} from "./_components/footer";
import {Heading} from "./_components/heading";
import {Heroes} from "./_components/heroes";
import HoundCarousel from "./_components/hound-carousel";

const MarketingPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F] pt-12">
            <div
                className="flex flex-col md:flex-col lg:flex-row xl:flex-row items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-5">
                <div className="w-full lg:w-1/2 items-end">
                    <Heading/>
                </div>
                <div className="w-full lg:w-1/2">
                    <HoundCarousel/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MarketingPage;
