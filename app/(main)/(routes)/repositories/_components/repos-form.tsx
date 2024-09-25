"use client"

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react';
import { repositoriesDataRequest } from '@/api/server-data';
import { useAuthStore } from '@/store/auth';
import { set } from 'lodash';
 
const FormSchema = z.object({
    repos: z
    .string()
    .min(26, {
        message: "La URL del repositorio debe tener al menos 26 caracteres.",
    })
})

interface ReposFormProps {
    setRepos: React.Dispatch<React.SetStateAction<any>>;
}

export const ReposForm = ({setRepos}: ReposFormProps) => {
    const {profile} = useAuthStore(state => state);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            repos: localStorage.getItem('repos') || '',
        },
    })

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        const savedRepos = localStorage.getItem('repos');
        if (savedRepos) {
            form.setValue('repos', savedRepos);
        }
    }, [form]);
     
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const username = profile.username;
            const res = await repositoriesDataRequest(data.repos, username);
            console.log(res.data);
            setRepos(res.data);
            localStorage.setItem('repos', data.repos);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                    control={form.control}
                    name="repos"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Enlista los repositorios que deseas agregar</FormLabel> */}
                            <FormControl>
                                <Textarea
                                    placeholder="Ejemplo: https://github.com/username/repo"
                                    className="resize-none h-96"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Recomendamos comparar no más de 12 repositorios a la vez.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="flex w-full sm:justify-start mt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                        variant="default"
                        size="sm"
                    >
                        <>
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
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
    )
}