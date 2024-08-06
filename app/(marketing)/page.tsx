import {Footer} from "./_components/footer";
import {Heading} from "./_components/heading";
import {Heroes} from "./_components/heroes";
import HoundCarousel from "./_components/hound-carousel";

const MarketingPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div
                className="flex flex-row items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-5">
                <Heading/>
                <div className="flex items-center justify-center w-full">
                    <HoundCarousel/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MarketingPage;
