import useCart from "@/store/repos";
import Repo from "./repo";
import { useEffect, useState } from "react";

const Repos = ({repos}: { repos: any[] }) => {
    const { addMultipleItemsToCart, removeMultipleItemsFromCart, cart } = useCart();

    const areAllReposInCart = repos.every((repo) => cart.some((item) => item.id === repo.id)); 
    const [selectAll, setSelectAll] = useState(areAllReposInCart);

    useEffect(() => {
        setSelectAll(areAllReposInCart);
    }, [cart, areAllReposInCart]);

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            addMultipleItemsToCart({ newItems: repos });
        } else {
            removeMultipleItemsFromCart({ items: repos });
        }
    };

    return (
        <div className='md:w-full w-full'>
            {repos.length > 0 ? (
                <div className='flex flex-col'>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                            aria-label="Select all repos"
                        />
                        <span className="ml-2 text-sm">Seleccionar todos</span>
                    </div>
                    <div className='px-1 md:px-0 grid md:grid-cols-2 gap-4 pt-4'>
                        {repos.map((repo) => (
                            <Repo key={repo.id} repo={repo} />
                        ))}
                    </div>
                </div>
            ) : (
                <p className='flex items-center justify-center h-32' aria-live="polite">
                    No se encontraron proyectos Spring Boot monolíticos.
                </p>
            )}
        </div>
    );
};
export default Repos;