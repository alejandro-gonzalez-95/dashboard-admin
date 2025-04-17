import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const saveLayout = async (formData) => {

    try {
        const response = await axios.post(`${BASE_URL}/layout`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
}

export const getAll = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/layout`);
        // console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
}

export const getLayoutById = async (layoutId) => {
    try {
        const response = await axios.get(`${BASE_URL}/layout/${layoutId}`);
        // console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
}

export const getFile = async (filename) => {
    try {
        const response = await axios.get(`${BASE_URL}/file/${filename}`, {
            responseType: "blob", // Esto asegura que la respuesta se obtenga como Blob
        });
        // console.log('Respuesta del servidor:', response.data);
        const blob = response.data;
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
}