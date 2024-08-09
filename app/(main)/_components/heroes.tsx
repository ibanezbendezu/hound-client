import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <Image
                    src="/u1f415.svg"
                    height={140}
                    width={140}
                    className="relative w-[80px] h-[80px] sm:w-[105px] sm:h-[105px] md:w-[140px] md:h-[140px] object-contain"
                    alt="Mascot"
                    priority={true}
                />
            </div>
        </div>
    );
};
