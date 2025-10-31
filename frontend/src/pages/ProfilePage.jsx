import { useEffect, useState } from "react";
import api from "../services/axios";
import { FiEdit2, FiSave, FiXCircle, FiUser, FiMail, FiLock, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import InfoCard from "../components/InfoCard";

export default function ProfilePage() {
    const [details, setDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get("/userdetails");
                setDetails(res.data);
                setFormData({ name: res.data.name, email: res.data.user.email });
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, []);

    const handleSave = async () => {
        try {
            const res = await api.put("/userdetails", formData);
            setDetails(res.data);
            setEditMode(false);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    if (!details) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="p-6 transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--primary-color)]">Profile Settings</h2>
                    <p className="text-sm text-[var(--muted-text)]">Manage your account information</p>
                </div>

                {!editMode ? (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
                        style={{ background: 'var(--primary-color)' }}
                    >
                        <FiEdit2 size={18} />
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
                            style={{ background: 'var(--success-color)' }}
                        >
                            <FiSave size={18} /> Save
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
                            style={{ background: 'var(--danger-color)' }}
                        >
                            <FiXCircle size={18} /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="col-md-12 col-lg-12 border rounded p-2">
                <InfoCard icon={<FiUser size={20} className="text-[var(--primary-color)]" />} title="Name">
                    {editMode ? (
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded-md bg-transparent focus:border-[var(--primary-color)] focus:ring-0 outline-none"
                            style={{ borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
                        />
                    ) : (
                        <p className="text-lg">{details.name}</p>
                    )}
                </InfoCard>

                <InfoCard icon={<FiMail size={20} className="text-[var(--primary-color)]" />} title="Email">
                    {editMode ? (
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded-md bg-transparent focus:border-[var(--primary-color)] focus:ring-0 outline-none"
                            style={{ borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
                        />
                    ) : (
                        <p className="text-lg">{details.user.email}</p>
                    )}
                </InfoCard>

                <InfoCard icon={<FiLock size={20} className="text-[var(--primary-color)]" />} title="Password" className="md:col-span-2">
                    <p className="text-sm text-[var(--muted-text)] mb-2">
                        Last changed: <span className="font-medium" style={{ color: 'var(--text-color)' }}>{details.passwordLastChanged ? new Date(details.passwordLastChanged).toLocaleDateString() : new Date(details.joinedAt).toLocaleDateString()}</span>
                    </p>
                    <button className="px-4 py-2 rounded-lg transition" style={{ background: 'var(--secondary-color)', color: 'var(--primary-color)' }}>
                        Change Password
                    </button>
                </InfoCard>

                <InfoCard icon={<FiCalendar size={20} className="text-[var(--primary-color)]" />} title="Joined On">
                    <p className="text-lg">{new Date(details.createdAt).toLocaleDateString()}</p>
                </InfoCard>

                <InfoCard icon={<FiCalendar size={20} className="text-[var(--primary-color)]" />} title="Last Updated">
                    <p className="text-lg">{new Date(details.updatedAt).toLocaleDateString()}</p>
                </InfoCard>
            </div>
        </div>
    );
}
