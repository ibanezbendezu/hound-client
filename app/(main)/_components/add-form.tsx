'use client';

import React, {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from "next/navigation";
import {Button} from '@/components/ui/button';
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Select from 'react-select';
import {customStyles} from './lib/utils';
import useStore from '@/store/groups';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {useAuthStore} from '@/store/auth';
import useCart from '@/store/repos';
import {groupSummaryRequest, groupUpdateRequestBySha} from '@/api/server-data';
import {formatDateTime} from '@/lib/utils';
import { CustomAlert } from './custom-alert';
import { LoadingModal } from '@/components/modals/loading-modal';

const formSchema = z.object({
    grupo: z.number(),
});

interface AddFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    cartCollapse: () => void;
    setIsLoading: Dispatch<React.SetStateAction<boolean>>;
}

export default function AddForm({setIsOpen, cartCollapse, setIsLoading}: Readonly<AddFormProps>) {
    const router = useRouter();
    const {profile} = useAuthStore(state => state);
    const {cart, emptyCart} = useCart(state => state);
    const {store, updateGroupInStore} = useStore(state => state);

    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(0);
    const [reposToAdd, setReposToAdd] = useState<any[]>([]);
    const [groupSha, setGroupSha] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grupo: 0,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onValidate = (values: z.infer<typeof formSchema>) => {
        const group = store.find(group => group.id === values.grupo);
        setGroupSha(group.sha);
        
        const prevRepos = group.repositories;
        const newRepos = cart.map(repo => ({
            owner: repo.owner.login,
            name: repo.name,
        }));

        const existingRepos = newRepos.filter(newRepo =>
            prevRepos.some((prevRepo: { owner: any; name: any ;}) => 
                prevRepo.name === newRepo.name && prevRepo.owner === newRepo.owner
            )
        );

        const reposToAdd = newRepos.filter(newRepo =>
            !prevRepos.some((prevRepo: { owner: any; name: any; }) => 
                prevRepo.name === newRepo.name && prevRepo.owner === newRepo.owner
            )
        );

        if (existingRepos.length === newRepos.length) {
            setAlertType(2);
            setShowAlert(true);
            setIsButtonDisabled(false);
        } else if (existingRepos.length > 0) {
            setReposToAdd([...reposToAdd, ...prevRepos]);
            setAlertType(3);
            setShowAlert(true);
            setIsButtonDisabled(true);
            return;
        } else {
            setReposToAdd([...reposToAdd, ...prevRepos]);
            setAlertType(4);
            setShowAlert(true);
            setIsButtonDisabled(true);
            return;
        }
    }

    const recursiveFactorial = (n: number): number => {
        if (n === 0) {
            return 1;
        }
        return n * recursiveFactorial(n - 1);
    }

    const combinations = (n: number) => {
        // n over k combinations
        const k = 2;
        const nMinusK = n - k;
        const nFactorial = recursiveFactorial(n);
        const kFactorial = recursiveFactorial(k);
        const nMinusKFactorial = recursiveFactorial(nMinusK);
        const nChooseK = nFactorial / (kFactorial * nMinusKFactorial);

        // 6 seconds per request
        return nChooseK;
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (values.grupo === 0) {
            setShowAlert(true);
            setAlertType(1);
            return;
        }
        
        try {
            /* setIsLoading(true);
            const username = profile.username;
            const data = await groupUpdateRequestBySha(groupSha, reposToAdd, username);
            updateGroupInStore({id: values.grupo, updatedGroup: {...data.data, repositories: reposToAdd}});
            emptyCart();
            setIsOpen(false);
            cartCollapse();
            router.push(`/groups/${data.data.sha}`); */

            setIsLoading(true);
            setLoading(true);
            const combs = combinations(reposToAdd.length);
        
            setPercentage(0);
            setIsOpen(true);

            const username = profile.username;

            const group = await groupUpdateRequestBySha(groupSha, reposToAdd, username);
            const pId = setInterval(() => {
                if(percentage >= 99)
                    clearInterval(pId);
                setPercentage(prev => prev + 1);
            }, 6 * combs * 10);

            const iId = setInterval(async () => {
                const summary = await groupSummaryRequest(group.data.sha);
                if (summary.data.comparissonsCompleted === combs) {
                    clearInterval(pId);
                    clearInterval(iId);

                    updateGroupInStore({ sha: group.data.sha, ...summary.data });
                    emptyCart();

                    setIsOpen(false);
                    cartCollapse();
                    setLoading(false);
                    setPercentage(100);
                    
                    router.push(`/groups/${group.data.sha}`);
                }
            }, 6000);

        } catch (error) {
            console.log(error);
        }
    };

    const options = store.map(group => ({
        value: group.id,
        label: formatDateTime(group.groupDate),
    }));

    return (
        <>
            <LoadingModal isOpen={loading} percentage={percentage} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4 sm:px-0 px-4"
                >
                    {showAlert && (
                        <CustomAlert option={alertType}/>
                    )}
                    <FormField
                        control={form.control}
                        name="grupo"
                        render={({field: {onChange, value}}) => (
                            <FormItem>
                                <FormLabel>Comparaciones</FormLabel>
                                <Select
                                    options={options}
                                    styles={customStyles}
                                    placeholder="Selecciona un grupo..."
                                    value={options.find((option) => option.value === value)}
                                    onChange={(option) => {
                                        onChange(option?.value);
                                        setShowAlert(false);
                                        onValidate({grupo: option?.value});
                                    }}
                                />
                                <FormDescription>
                                    Escoge el grupo al que quieres agregar repositorios
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full sm:justify-end mt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !isButtonDisabled}
                            className="w-full sm:w-auto"
                        >
                            <>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Agregando...
                                    </>
                                ) : (
                                    'Confirmar'
                                )}
                            </>
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}