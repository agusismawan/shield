import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function App() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const onSubmit = async data => {
        console.log(data);
        await sleep(1000);
        axios.post('http://172.18.134.228/v1.0/incidents', data)
            .then(function (response) {
                response.status === 201 ? alert('Data berhasil disimpan') : alert(`Gagal Error Code : ${response.status}`)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Incident Name" {...register("incidentName", { required: true })} />
            {errors.incidentName?.type === 'required' && "This is required"}
            <select {...register("idApps", { required: true })}>
                <option value="1">Brimo</option>
                <option value="2">Brilink</option>
                <option value="3">Brispot</option>
            </select>
            <select {...register("idUrgency", { required: true })}>
                <option value="1">Low</option>
                <option value="2">High</option>
                <option value="3">Medium</option>
            </select>
            <input type="text" placeholder="Impacted System" {...register("impactedSystem", { required: true })} />
            {errors.impactedSystem?.type === 'required' && "This is required"}
            <input type="datetime-local" format-value="yyyy-MM-ddTHH:mm" placeholder="startTime" {...register("startTime", { required: true })} />
            {errors.startTime?.type === 'required' && "This is required"}

            <input type="submit" />
        </form>
    );
}