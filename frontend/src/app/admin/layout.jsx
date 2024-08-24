"use client";

import { useEffect } from 'react';
import { fetchAccessToken } from "@/lib/utilities";

export default function layout({ children }) {
    async function getToken() {
        try {
            const token = await fetchAccessToken();
            localStorage.setItem('adminConfig', JSON.stringify({ token }));
        } catch (err) {
            console.error(err);
            localStorage.removeItem('adminConfig');    
        }
    }
    useEffect(() => {
        const savedConfig = localStorage.getItem('adminConfig');
        if (!savedConfig) {
            getToken();
        }
    }, []);

  return children;
}
