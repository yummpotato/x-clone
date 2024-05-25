import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children,
}: {
    children: React.ReactNode;
}) {
    // user가 로그인했는지 확인
    const user = auth.currentUser;

    // user가 맞다면 children return, 아니라면 login page로 이동
    if(user === null) {
        return <Navigate to="/login"/>;
    }
    return children;
}