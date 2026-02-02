import React from 'react'

const OrderTimeLine = ({ order }) => {

    const ORDER_STEPS = [
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
    ];

    const STATUS_ICONS = {
        Confirmed: "✔",
        Packed: "📦",
        Shipped: "🚚",
        Delivered: "✅",
    };


    const updateTimeLine = (status) => {
        const entry = order?.orderHistory?.find((item) => item.to === status)
        return entry ? new Date(entry.changedAt).toLocaleDateString() : 'Pending'
    }

    return (
        <div>
            <div className="bg-white p-5 rounded shadow">
                <h3 className="font-semibold mb-3">Order Timeline</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                    <li>✔ Order Placed – {' '} {new Date(order?.createdAt).toLocaleDateString()}</li>
                    {ORDER_STEPS.map((status, index) => {
                        return (<li key={index}>{STATUS_ICONS[status]} {status} – {' '} {updateTimeLine(status)}</li>)
                    })}

                </ul>
            </div>
        </div>
    )
}

export default OrderTimeLine
