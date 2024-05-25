import { useState } from "react";
import potatoImage from "/Users/parkhyejeong/Desktop/twitter-clone/x-clone/public/potato.png";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Error, Form, Input, Logo, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        {/* 이벤트에서 target 추출 */}
        const { target: {name, value} } = e;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        } 
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 화면이 새로고침되지 않도록 하는 함수
        setError("");

        if(isLoading || email === "" || password === "") return;

        try {
            setLoading(true);
            
            // not cordova!
            await signInWithEmailAndPassword(auth, email, password);

            // navigate to home
            navigate("/");
        } catch(e) {
            // 오류 설정 필요
            // 자격 증명을 발급받지 못 했을 경우 실행
            // ex, 해당 이메일로 이미 계정이 있거나 비밀번호가 유호하지 않은 경우
            if(e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return <Wrapper>
        <Logo src={potatoImage} alt="Logo" />
        <Title>Log into 감자' 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/> {/* email */}
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/> {/* password */}
            <Input onChange={onChange} type="submit" value={isLoading ? "Loading..." : "Login"}/> {/* login btn */}
        </Form>
        {error != "" ? <Error>{error}</Error> : null}
        <Switcher>
            계정이 없으신가요? <Link to="/create-account">회원가입</Link>
        </Switcher>
        <GithubButton/>
    </Wrapper>;
}