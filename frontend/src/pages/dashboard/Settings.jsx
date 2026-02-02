import React from 'react'
import Sidebar from '../../components/Sidebar'
import { Settings as SettingsIcon, Store, ShoppingBag, ShieldCheck, Save } from "lucide-react";
import BusinessSettingsForm from '../../components/settingsComponents/BusinessSettingsForm';
import OrderSettingsForm from '../../components/settingsComponents/OrderSettingsForm';


const Settings = () => {


    return (

        <div className='flex'>
            <Sidebar />

            <div className="w-full max-h-screen overflow-y-auto p-6 space-y-10 bg-gray-50">

                {/* ================= Page Header ================= */}
                <div className="flex items-start gap-3">
                    <SettingsIcon className="w-7 h-7 text-blue-600 mt-1" />
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
                    </div>
                </div>
                <div>
                    <p className="mb-1 ml-1 text-gray-500 font-bold text-2xl">
                        Manage your store configuration and system preferences
                    </p>
                    <BusinessSettingsForm />
                </div>
                <OrderSettingsForm />

            </div>

        </div>
    )
}

export default Settings
