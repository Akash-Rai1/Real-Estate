import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
    updateUserFaliure,
    updateUserStart,
    updateUserSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function Profile() {
    const fileRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [formData, setFormData] = useState({});
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const dispach = useDispatch();
    console.log(formData);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercentage(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispach(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispach(updateUserFaliure(data.message));
                return;
            }

            dispach(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispach(updateUserFaliure(error.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <img
                    onClick={() => {
                        fileRef.current.click();
                    }}
                    src={formData.avatar || currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-700">
                            Error in image upload , file must be less then 2 mb
                        </span>
                    ) : filePercentage > 0 && filePercentage < 100 ? (
                        <span className="text-green-600">{`Uploading ${filePercentage} %`}</span>
                    ) : filePercentage === 100 ? (
                        <span className="text-green-600">{`Uploaded successfully`}</span>
                    ) : (
                        ""
                    )}
                </p>

                <input
                    type="text"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    id="email"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="password"
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
                >
                    Update
                </button>
                <div className="flex justify-between mt-5">
                    <span className=" text-red-700 cursor-pointer">
                        Delete account
                    </span>
                    <span className=" text-red-700 cursor-pointer">
                        Sign Out
                    </span>
                </div>
            </form>
        </div>
    );
}
