import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const SettingsContext = createContext();

export const SettingsContextProvider = (props) => {

    const [settings, setSettings] = useState(null);


    async function fetchSettings() {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/settings/fetch`,
                withCredentials: true
            })

            const { message, success, allSettings } = resposne.data;
            if (success) {
                console.log(message)
                setSettings(allSettings)
            }
        }
        catch (error) {
            console.error('settingsFunc error', error)
        }
    }


    useEffect(() => {
        fetchSettings()
    }, [])


    const value = { fetchSettings, settings, setSettings };

    return (
        <SettingsContext.Provider value={value}>
            {props.children}
        </SettingsContext.Provider>
    )
}