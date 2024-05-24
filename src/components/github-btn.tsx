import { GithubAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
    background-color: white;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    color: black;
    width:100%;
    cursor: pointer;
    &:hover {
        opacity: 0.8; // 투명도 설정
    }
`;

const Logo = styled.img`
    height: 25px;
`;

export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            // not cordova!
            const provider = new GithubAuthProvider();
            // github 로그인을 취소하면 다시 login page로 돌아오게 됨.
            // await signInWithRedirect(auth, provider);

            // popup창에서 github 로그인이 이루어짐.
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch(e) {
            console.log(e);
        }
        
    }
    return (
        <Button onClick={onClick}>
            <Logo src="/github-logo.svg" />
            Continue with Github
        </Button>
    );
}