import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2 pl-14">
            <Link href="/">
                <Image
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
                />
            </Link>
        </div>
    );
};
