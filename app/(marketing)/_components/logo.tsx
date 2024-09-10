import Image from "next/image";
import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            {/* <Image
                src="/u1f436-g-bw.svg"
                height={40}
                width={40}
                alt="Logo"
                className="dark:hidden"
            />
            <Image
                src="/u1f436-g-bw.svg"
                height={40}
                width={40}
                alt="Logo"
                className="hidden dark:block filter invert"
            /> */}
            <p className={cn("font-semibold", font.className)}>Hound</p>
        </div>
    );
};
