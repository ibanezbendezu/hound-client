import { GetStaticPropsContext } from 'next';

// This function generates the static parameters for the dynamic route
export async function generateStaticParams() {
    // Fetch or define the parameters for the dynamic route
    const params = [
        { id: '1', fileId: 'a' },
        { id: '2', fileId: 'b' },
        // Add more parameters as needed
    ];

    return params.map(param => ({
        params: {
            id: param.id,
            fileId: param.fileId,
        },
    }));
}
