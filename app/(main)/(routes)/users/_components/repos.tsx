import Repo from "./repo";

const Repos = ({repos}: { repos: any[] }) => {
    return (
        <div className='md:w-full w-full'>
            {repos.length > 0 ? (
                <div className='px-1 md:px-0 grid md:grid-cols-2 gap-4 pt-4'>
                    {repos.map((repo) => (
                        <Repo key={repo.id} repo={repo} />
                    ))}
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