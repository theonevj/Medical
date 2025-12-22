import React, { useState, useRef } from "react";

const initialData = {
    Ortho: [
        { id: 1, name: "Knee Replacement Case" },
        { id: 2, name: "Hip Fracture Presentation" },
        { id: 3, name: "ACL Injury Review" },
        { id: 4, name: "Shoulder Dislocation Deck" },
        { id: 5, name: "Spine Alignment Study" },
    ],
    Radio: [
        { id: 6, name: "Chest X-Ray Case A" },
        { id: 7, name: "MRI Brain Analysis" },
        { id: 8, name: "CT Scan Abdomen" },
        { id: 9, name: "Ultrasound Liver Findings" },
    ],
    Neurologist: [
        { id: 10, name: "Stroke Case Study" },
        { id: 11, name: "Epilepsy Treatment Plan" },
        { id: 12, name: "Parkinson’s Progression Deck" },
        { id: 13, name: "Migraine Diagnosis Flow" },
        { id: 14, name: "Neuro Trauma Review" },
    ],
};

const PresentationDetails = () => {
    const [data, setData] = useState(initialData);
    const [type, setType] = useState(Object.keys(initialData)[0]);
    const [newType, setNewType] = useState("");

    const [dragIndex, setDragIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const timerRef = useRef(null);

    /* ---------------- Long Press Drag Logic ---------------- */
    const startLongPress = (index) => {
        timerRef.current = setTimeout(() => {
            setDragIndex(index);
            setIsDragging(true);
        }, 300);
    };

    const cancelLongPress = () => {
        clearTimeout(timerRef.current);
    };

    const onDragEnter = (index) => {
        if (!isDragging || dragIndex === index) return;

        const list = [...data[type]];
        const draggedItem = list[dragIndex];

        list.splice(dragIndex, 1);
        list.splice(index, 0, draggedItem);

        setDragIndex(index);
        setData({ ...data, [type]: list });
    };

    const onDrop = () => {
        setDragIndex(null);
        setIsDragging(false);
    };

    const handleClick = (e, item) => {
        if (isDragging) {
            e.preventDefault();
            return;
        }
        window.open(`/presentation/${item.id}`, "_blank");
    };

    /* ---------------- Add New Type ---------------- */
    const addNewType = () => {
        if (!newType.trim() || data[newType]) return;

        setData({
            ...data,
            [newType]: [],
        });
        setType(newType);
        setNewType("");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-[Poppins]">
            {/* Header */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    Presentation Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Click to open • Long press to reorder
                </p>
            </div>

            {/* Type Controls */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    {Object.keys(data).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Add new type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                />

                <button
                    onClick={addNewType}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                    + Add
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow divide-y">
                {data[type]?.length === 0 && (
                    <div className="p-5 text-sm text-gray-400">
                        No presentations found
                    </div>
                )}

                {data[type]?.map((item, index) => (
                    <div
                        key={item.id}
                        draggable={dragIndex === index}
                        onDragEnter={() => onDragEnter(index)}
                        onDragEnd={onDrop}
                        onMouseDown={() => startLongPress(index)}
                        onMouseUp={cancelLongPress}
                        onMouseLeave={cancelLongPress}
                        onTouchStart={() => startLongPress(index)}
                        onTouchEnd={cancelLongPress}
                        onClick={(e) => handleClick(e, item)}
                        className={`flex items-center justify-between px-5 py-4
              ${dragIndex === index ? "bg-blue-50 opacity-70" : "hover:bg-gray-50"}
              cursor-pointer`}
                    >
                        <span className="text-sm text-gray-700">
                            {item.name}
                        </span>

                        <div className="flex gap-4 text-sm">
                            <span className="text-blue-600">Open</span>
                            <span className="text-green-600">Create Link</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PresentationDetails;
