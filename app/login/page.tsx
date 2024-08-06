import Image from "next/image";
import {Footer} from "./_components/footer";
import {LoginForm} from "./_components/login-form";

const LoginPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div
                className="flex flex-col items-center justify-center text-center gap-y-10 flex-1 px-6 pt-20">
                <LoginForm/>
                <Image
                    src="/u1f415-g-bw.svg"
                    height={200}
                    width={200}
                    alt="Logo"
                    className="dark:hidden"
                />
                <Image
                    src="/u1f415-g-bw.svg"
                    height={200}
                    width={200}
                    alt="Logo"
                    className="hidden dark:block filter invert"
                />
            </div>
            <Footer/>
        </div>
    );
};

export default LoginPage;
