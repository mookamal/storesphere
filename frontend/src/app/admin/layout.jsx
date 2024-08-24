"use client";

import { useEffect } from 'react';
import { fetchAccessToken } from "@/lib/utilities";

export default function layout({ children }) {
    const now = new Date();
    async function getToken() {
        try {
            const token = await fetchAccessToken();
            const ttlSeconds = 86400000;
            const expires = now.getTime() + ttlSeconds;
            const adminConfig = {
                token,
                expires,
            };
            localStorage.setItem('adminConfig', JSON.stringify(adminConfig));
        } catch (err) {
            console.error(err);
            localStorage.removeItem('adminConfig');    
        }
    }
    useEffect(() => {
        
        const savedConfig = localStorage.getItem('adminConfig');
        if (!savedConfig) {
            getToken();
        } else {
            const config = JSON.parse(savedConfig);
            const { expires } = config;
            if (now.getTime() > expires) {
                localStorage.removeItem('adminConfig');
                getToken();
            }
        }
    }, []);

  return children;
}